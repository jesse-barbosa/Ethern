import React, { useState } from "react"
import { View, Text, Modal, TouchableOpacity, StyleSheet, Switch } from "react-native"
import { X, Check, Calendar, Clock, AlertCircle } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

export type FilterOptions = {
  showCompleted: boolean
  showPending: boolean
  showOverdue: boolean
  sortBy: "date" | "created" | "alphabetical"
}

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: FilterOptions) => void
  initialFilters: FilterOptions
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, initialFilters }) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters)

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const SortOption = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
    <TouchableOpacity
      style={[styles.sortOption, filters.sortBy === value && styles.sortOptionSelected]}
      onPress={() => setFilters({ ...filters, sortBy: value as any })}
    >
      <View style={styles.sortOptionIcon}>{icon}</View>
      <Text style={[styles.sortOptionText, filters.sortBy === value && styles.sortOptionTextSelected]}>{title}</Text>
      {filters.sortBy === value && <Check size={18} color="#A9DC4D" />}
    </TouchableOpacity>
  )

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar Tarefas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Mostrar tarefas concluídas</Text>
              <Switch
                value={filters.showCompleted}
                onValueChange={(value) => setFilters({ ...filters, showCompleted: value })}
                trackColor={{ false: "#333", true: "rgba(169, 220, 77, 0.4)" }}
                thumbColor={filters.showCompleted ? "#A9DC4D" : "#f4f3f4"}
              />
            </View>
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Mostrar tarefas pendentes</Text>
              <Switch
                value={filters.showPending}
                onValueChange={(value) => setFilters({ ...filters, showPending: value })}
                trackColor={{ false: "#333", true: "rgba(169, 220, 77, 0.4)" }}
                thumbColor={filters.showPending ? "#A9DC4D" : "#f4f3f4"}
              />
            </View>
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Mostrar tarefas atrasadas</Text>
              <Switch
                value={filters.showOverdue}
                onValueChange={(value) => setFilters({ ...filters, showOverdue: value })}
                trackColor={{ false: "#333", true: "rgba(169, 220, 77, 0.4)" }}
                thumbColor={filters.showOverdue ? "#A9DC4D" : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordenar por</Text>
            <View style={styles.sortOptions}>
              <SortOption title="Data" value="date" icon={<Calendar size={18} color={filters.sortBy === "date" ? "#A9DC4D" : "#AAAAAA"} />} />
              <SortOption
                title="Criação"
                value="created"
                icon={<Clock size={18} color={filters.sortBy === "created" ? "#A9DC4D" : "#AAAAAA"} />}
              />
              <SortOption
                title="Alfabética"
                value="alphabetical"
                icon={<Text style={{ color: filters.sortBy === "alphabetical" ? "#A9DC4D" : "#AAAAAA", fontSize: 16 }}>A-Z</Text>}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.85}>
            <LinearGradient
              colors={["#A9DC4D", "#8BC34A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyButtonGradient}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
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
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#A9DC4D",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  sortOptions: {
    marginTop: 8,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
  },
  sortOptionSelected: {
    backgroundColor: "rgba(169, 220, 77, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(169, 220, 77, 0.3)",
  },
  sortOptionIcon: {
    marginRight: 12,
  },
  sortOptionText: {
    fontSize: 16,
    color: "#FFFFFF",
    flex: 1,
  },
  sortOptionTextSelected: {
    color: "#A9DC4D",
    fontWeight: "500",
  },
  applyButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  applyButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
})

export default FilterModal
