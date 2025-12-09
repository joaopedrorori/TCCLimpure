export type RewardType = "highlight_message" | "change_message_color" | "change_name_color" | "profile_decoration"

export interface UserReward {
  id: string
  type: RewardType
  title: string
  daysRequired: number
  claimedAt: number
  messageColor?: string
  nameColor?: string
  selectedMessageColor?: string
}

export interface RewardConfig {
  id: RewardType
  title: string
  daysRequired: number
  messageColor?: string
  nameColor?: string
}
