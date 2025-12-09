"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, SafeAreaView } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

type ColorPickerModalProps = {
  visible: boolean
  onSelectColor: (color: string) => void
  onCancel: () => void
}

const COLORS = [
  "#FF6B6B", // Red
  "#FF8C42", // Orange
  "#FFC93C", // Yellow
  "#118AB2", // Blue
  "#073B4C", // Dark Blue
  "#EF476F", // Pink
  "#FFD166", // Light Yellow
  "#06D6A0", // Teal
  "#9D4EDD", // Purple
  "#3A86FF", // Sky Blue
  "#8338EC", // Violet
  "#FFBE0B", // Gold
  "#FB5607", // Orange-Red
  "#FF006E", // Hot Pink
]

export function ColorPickerModal({ visible, onSelectColor, onCancel }: ColorPickerModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0])

  const handleApply = () => {
    onSelectColor(selectedColor)
    setSelectedColor(COLORS[0])
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Escolha a Cor Desejada</Text>
            <TouchableOpacity onPress={onCancel}>
              <Icon name="close" size={28} color="#2C75B5" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.colorGridContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && <Icon name="check" size={24} color="#FFF" />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Pré-visualização:</Text>
              <View style={[styles.previewBubble, { backgroundColor: selectedColor }]}>
                <Text style={styles.previewText}>Sua mensagem aparecerá assim</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C75B5",
  },
  colorGridContainer: {
    paddingBottom: 20,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  colorOption: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorSelected: {
    borderColor: "#000",
    borderWidth: 3,
  },
  previewSection: {
    marginTop: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C75B5",
    marginBottom: 12,
  },
  previewBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#2C75B5",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#2C75B5",
    fontSize: 16,
    fontWeight: "700",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#2C75B5",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
})
