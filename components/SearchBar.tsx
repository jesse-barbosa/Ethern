import React from "react"
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { Search, X, Filter } from "lucide-react-native"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onClear: () => void
  onFilterPress: () => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onClear, onFilterPress, placeholder = "Pesquisar tarefas..." }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#777"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <X size={18} color="#777" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Filter size={20} color="#A9DC4D" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    color: "#FFFFFF",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(169, 220, 77, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(169, 220, 77, 0.3)",
  },
})

export default SearchBar
