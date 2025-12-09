"use client"

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"
import { useEffect, useState } from "react"
import { useUser } from "../../context/UserContext"

import type { RewardConfig } from "../../types/rewards"
import { db } from "../../services/firebase"
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, serverTimestamp, query, where } from "firebase/firestore"
import { ColorPickerModal } from "./color-picker-modal"

type RewardItemProps = {
  title: string
  diasNecessarios: number
  icon?: string
  diasUsuario: number
  onPress: () => void
  isClaimed?: boolean
  canChangeColor?: boolean
}

function RewardCard({
  title,
  diasNecessarios,
  icon,
  diasUsuario,
  onPress,
  isClaimed,
  canChangeColor,
}: RewardItemProps) {
  const isLocked = diasUsuario < diasNecessarios
  const diasFaltantes = diasNecessarios - diasUsuario

  return (
    <TouchableOpacity
      style={[styles.card, isLocked && styles.cardLocked, isClaimed && styles.cardClaimed]}
      onPress={onPress}
      disabled={isLocked && !canChangeColor}
      activeOpacity={isLocked && !canChangeColor ? 1 : 0.7}
    >
      {isClaimed && !canChangeColor && (
        <View style={styles.claimedOverlay}>
          <Icon name="check-circle" size={24} color="#4CAF50" />
        </View>
      )}
      {isLocked && !isClaimed && (
        <View style={styles.lockOverlay}>
          <Icon name="lock" size={24} color="#FFF" />
        </View>
      )}
      {icon && (
        <View style={styles.iconContainer}>
          <Text style={styles.iconEmoji}>{icon}</Text>
        </View>
      )}
      <Text style={[styles.cardTitle, isLocked && styles.cardTitleLocked, isClaimed && styles.cardTitleClaimed]}>
        {title}
      </Text>
      <View style={[styles.diasBadge, isLocked && styles.diasBadgeLocked, isClaimed && styles.diasBadgeClaimed]}>
        <Text style={[styles.diasText, isLocked && styles.diasTextLocked, isClaimed && styles.diasTextClaimed]}>
          {diasNecessarios} dias
        </Text>
      </View>
      {isLocked && !isClaimed && <Text style={styles.faltamText}>Faltam {diasFaltantes} dias</Text>}
      {isClaimed && !canChangeColor && <Text style={styles.claimedText}>✓ Resgatado</Text>}
      {canChangeColor && isClaimed && <Text style={styles.changeColorText}>🎨 Trocar Cor</Text>}
    </TouchableOpacity>
  )
}

export function LojaRecompensa({ navigation }: any) {
  const { user } = useUser()
  const [diasLimpo, setDiasLimpo] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [claimedRewards, setClaimedRewards] = useState<string[]>([])
  const [colorPickerVisible, setColorPickerVisible] = useState(false)
  const [pendingReward, setPendingReward] = useState<RewardConfig | null>(null)

  const rewardsConfig: RewardConfig[] = [
    { id: "highlight_message", title: "Destacar Mensagem no Chat", daysRequired: 15 },
    { id: "change_message_color", title: "Mudar Cor da Mensagem no Chat", daysRequired: 0, messageColor: "#FF6B6B" },
    { id: "change_name_color", title: "Mudar Cor do Nome no Chat", daysRequired: 10, nameColor: "#4CAF50" },
    { id: "profile_decoration", title: "Decoração de Perfil", daysRequired: 10 },
  ]

  useEffect(() => {
    async function fetchData() {
      if (user && user.uid) {
        try {
          // Buscar dias limpo
          const userRef = doc(db, "users", user.uid)
          const dadosBanco = await getDoc(userRef)

          if (dadosBanco.exists() && dadosBanco.data().cleanDate) {
            const cleanDate = dadosBanco.data().cleanDate
            const date = new Date(cleanDate.seconds * 1000 + Math.floor(cleanDate.nanoseconds / 1000000))
            const now = new Date()
            const durationInMilliseconds = now.getTime() - date.getTime()
            const seconds = Math.floor(durationInMilliseconds / 1000)
            const hours = Math.floor(seconds / 3600)
            const days = Math.floor(hours / 24)
            setDiasLimpo(days)
          } else {
            // Simular 20 dias para teste
            setDiasLimpo(20)
          }

          // Buscar recompensas resgatadas
          const rewardsRef = collection(db, "users", user.uid, "rewards")
          const snapshot = await getDocs(rewardsRef)
          const claimed = snapshot.docs.map((doc) => doc.data().type)
          setClaimedRewards(claimed)
        } catch (error) {
          console.error("[v0] Erro ao buscar dados:", error)
          setDiasLimpo(20)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [user])

  const handleResgatar = async (rewardConfig: RewardConfig) => {
    if (!user || !user.uid) return

    const isColorReward = rewardConfig.id === "change_message_color"
    const alreadyClaimed = claimedRewards.includes(rewardConfig.id)

    if (diasLimpo < rewardConfig.daysRequired) {
      Alert.alert(
        "Recompensa Bloqueada",
        `Você precisa de ${rewardConfig.daysRequired} dias limpo para resgatar esta recompensa.`,
      )
      return
    }

    if (isColorReward) {
      setPendingReward(rewardConfig)
      setColorPickerVisible(true)
      return
    }

    // For other rewards, block if already claimed
    if (alreadyClaimed) {
      Alert.alert("Já Resgatado", `Você já resgatou: ${rewardConfig.title}`)
      return
    }

    await saveReward(rewardConfig)
  }

  const updateRewardColor = async (selectedColor: string) => {
    if (!user || !user.uid) return

    try {
      const rewardsRef = collection(db, "users", user.uid, "rewards")
      const q = query(rewardsRef, where("type", "==", "change_message_color"))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const rewardDoc = snapshot.docs[0]
        await updateDoc(rewardDoc.ref, {
          selectedMessageColor: selectedColor,
          updatedAt: serverTimestamp(),
        })

        Alert.alert("Cor Atualizada!", `Sua cor de mensagem foi alterada com sucesso.`, [{ text: "OK" }])
      }
    } catch (error) {
      console.error("[v0] Erro ao atualizar cor:", error)
      Alert.alert("Erro", "Não foi possível atualizar a cor. Tente novamente.")
    }
  }

  const saveReward = async (rewardConfig: RewardConfig, selectedColor?: string) => {
    if (!user || !user.uid) return

    try {
      const rewardsRef = collection(db, "users", user.uid, "rewards")
      await addDoc(rewardsRef, {
        type: rewardConfig.id,
        title: rewardConfig.title,
        daysRequired: rewardConfig.daysRequired,
        messageColor: rewardConfig.messageColor || null,
        nameColor: rewardConfig.nameColor || null,
        selectedMessageColor: selectedColor || null,
        claimedAt: serverTimestamp(),
      })

      setClaimedRewards([...claimedRewards, rewardConfig.id])

      Alert.alert("Recompensa Resgatada!", `Parabéns! Você resgatou: ${rewardConfig.title}`, [{ text: "OK" }])
    } catch (error) {
      console.error("[v0] Erro ao resgatar recompensa:", error)
      Alert.alert("Erro", "Não foi possível resgatar a recompensa. Tente novamente.")
    }
  }

  const handleColorSelected = async (color: string) => {
    setColorPickerVisible(false)
    if (pendingReward) {
      const alreadyClaimed = claimedRewards.includes(pendingReward.id)

      if (alreadyClaimed) {
        await updateRewardColor(color)
      } else {
        const rewardWithColor = { ...pendingReward, messageColor: color }
        await saveReward(rewardWithColor, color)
      }

      setPendingReward(null)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ColorPickerModal
        visible={colorPickerVisible}
        onSelectColor={handleColorSelected}
        onCancel={() => {
          setColorPickerVisible(false)
          setPendingReward(null)
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sistema de Recompensas</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.subtitle}>
          Ao longo do seu progresso, você pode resgatar recompensas de acordo com os dias que você está limpo!
        </Text>

        <View style={styles.badge}>
          <Icon name="calendar-check" size={16} color="#007AFF" style={styles.badgeIcon} />
          <Text style={styles.badgeText}>{diasLimpo} dias limpo</Text>
        </View>

        <View style={styles.grid}>
          {rewardsConfig.slice(0, 2).map((reward) => (
            <RewardCard
              key={reward.id}
              title={reward.title}
              diasNecessarios={reward.daysRequired}
              diasUsuario={diasLimpo}
              isClaimed={claimedRewards.includes(reward.id)}
              onPress={() => handleResgatar(reward)}
              canChangeColor={reward.id === "change_message_color" && claimedRewards.includes(reward.id)}
            />
          ))}
        </View>

        <View style={styles.grid}>
          {rewardsConfig.slice(2, 4).map((reward) => (
            <RewardCard
              key={reward.id}
              title={reward.title}
              diasNecessarios={reward.daysRequired}
              diasUsuario={diasLimpo}
              isClaimed={claimedRewards.includes(reward.id)}
              onPress={() => handleResgatar(reward)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: "#F5F5F5",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#007AFF",
        marginLeft: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
        lineHeight: 20,
    },
    badge: {
        alignSelf: "center",
        backgroundColor: "#E6F3FF",
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 10,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: "#007AFF",
        flexDirection: "row",
        alignItems: "center",
    },
    badgeIcon: {
        marginRight: 8,
    },
    badgeText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "700",
    },
    grid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 12,
    },
    card: {
        flex: 1,
        backgroundColor: "#007AFF",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 140,
        position: "relative",
    },
    cardLocked: {
        backgroundColor: "#B0B0B0",
        opacity: 0.7,
    },
    cardClaimed: {
        backgroundColor: "#4CAF50",
    },
    lockOverlay: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 20,
        padding: 6,
    },
    claimedOverlay: {
        position: "absolute",
        top: 10,
        right: 10,
        borderRadius: 20,
        padding: 6,
    },
    iconContainer: {
        marginBottom: 8,
    },
    iconEmoji: {
        fontSize: 32,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFF",
        textAlign: "center",
        marginBottom: 12,
    },
    cardTitleLocked: {
        color: "#E0E0E0",
    },
    cardTitleClaimed: {
        color: "#FFF",
    },
    diasBadge: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    diasBadgeLocked: {
        backgroundColor: "#E0E0E0",
    },
    diasBadgeClaimed: {
        backgroundColor: "#E8F5E9",
    },
    diasText: {
        fontSize: 12,
        color: "#007AFF",
        fontWeight: "600",
    },
    diasTextLocked: {
        color: "#888",
    },
    diasTextClaimed: {
        color: "#4CAF50",
    },
    faltamText: {
        marginTop: 8,
        fontSize: 11,
        color: "#FFF",
        fontWeight: "500",
    },
    claimedText: {
        marginTop: 8,
        fontSize: 11,
        color: "#FFF",
        fontWeight: "500",
    },
    changeColorText: {
        marginTop: 8,
        fontSize: 11,
        color: "#FFD700",
        fontWeight: "500",
    },
})
