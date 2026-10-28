import {
  Banknote,
  Building,
  Bus,
  CircleDollarSign,
  CircleQuestionMark,
  Ellipsis,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  type LucideIcon,
  PiggyBank,
  Receipt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Tag,
  Utensils,
  Wallet,
  WalletCards,
  WavesHorizontal,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  "shopping-basket": ShoppingBasket,
  bus: Bus,
  receipt: Receipt,
  "shopping-bag": ShoppingBag,
  "gamepad-2": Gamepad2,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  home: House,
  gift: Gift,
  "piggy-bank": PiggyBank,
  "more-horizontal": Ellipsis,
  wallet: Wallet,
  landmark: Landmark,
  smartphone: Smartphone,
  "building-2": Building,
  "wallet-cards": WalletCards,
  "circle-dollar-sign": CircleDollarSign,
  waves: WavesHorizontal,
  banknote: Banknote,
  "circle-help": CircleQuestionMark,
}

export function AppIcon({
  name,
  className,
}: {
  name: string | null | undefined
  className?: string
}) {
  const Icon = (name && iconMap[name]) || Tag

  return <Icon className={className} aria-hidden />
}
