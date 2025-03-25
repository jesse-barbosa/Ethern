import { supabase } from "../services/supabase";
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { useState, useEffect, useRef } from 'react';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

// Define expected params for this screen
type NotationsRouteProp = RouteProp<{ ViewNotation: { id: number } }, "ViewNotation">;

export default function Notations() {
  const route = useRoute<NotationsRouteProp>();
  const { id } = route.params;

  const navigation = useNavigation();
  const [notation, setNotation] = useState<{ id: number; title: string; message: string; updated_at: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [lineCount, setLineCount] = useState(20);
  const textRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchNotationData();
  }, [id]);

  // Função para calcular linhas dinamicamente
  const calculateLines = () => {
    const screenHeight = Dimensions.get('window').height;
    const lineHeight = 28; // Altura da linha de texto
    const maxLines = Math.ceil(screenHeight / lineHeight);
    
    // Calcula linhas baseado no texto
    if (notation?.message) {
      // Estima o número de linhas baseado no texto
      const estimatedLines = Math.ceil(notation.message.length / 40); // 40 caracteres por linha como estimativa
      const dynamicLineCount = Math.max(maxLines, estimatedLines);
      
      setLineCount(dynamicLineCount);
    }
  };

  useEffect(() => {
    if (notation) {
      calculateLines();
    }
    
    // Recalcula ao rotacionar a tela
    const subscription = Dimensions.addEventListener('change', calculateLines);
    
    return () => subscription.remove();
  }, [notation]);

  const fetchNotationData = async () => {
    const { data, error } = await supabase
      .from('notations')
      .select('id, title, message, updated_at')
      .eq('id', id)
      .single();
  
    if (error) {
      console.error('Error fetching notation data:', error);
    } else {
      setNotation(data);
      setEditedTitle(data.title);
      setEditedMessage(data.message);
    }
  };  

  const saveChanges = async () => {
    if (!notation) return;
    const { error } = await supabase
      .from('notations')
      .update({ title: editedTitle, message: editedMessage, updated_at: new Date().toISOString() })
      .eq('id', notation.id);
  
    if (error) {
      console.error('Error updating notation:', error);
    } else {
      fetchNotationData();
      setIsEditing(false);
    }
  };

  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteNotation = async () => {
    if (!notation) return;
    const { error } = await supabase
      .from('notations')
      .delete()
      .eq('id', notation.id);
  
    if (error) {
      console.error('Error deleting notation:', error);
    } else {
      (navigation as any).navigate('Notations');
      setIsDeleteModalVisible(false);
    }
  };

  function formatDate(dateString: string) {
    const inputDate = new Date(dateString);
    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Notebook line background component
  const NotebookBackground = () => {
    const lines = Array.from({ length: lineCount }, (_, index) => (
      <View 
        key={index} 
        style={[
          styles.line, 
          { top: index * 28 } // Espaçamento entre linhas equivalente à altura da linha de texto
        ]} 
      />
    ));

    return <View style={styles.notebookLines}>{lines}</View>;
  };

  return (
    <View className="flex-1">
      <View className="w-full flex flex-row items-start justify-between bg-blue-500 py-4 px-2">
        <View className="flex flex-col flex-1">
          <View className="flex flex-row w-full justify-between items-center">
            <TouchableOpacity onPress={() => {
              if (isEditing) {
                saveChanges();
              } else {
                (navigation as any).navigate("Notations");
              }
            }}>
              <MaterialIcons name="chevron-left" size={32} color="#fff" />
            </TouchableOpacity>

            {isEditing ? (
              <TextInput
                className="text-2xl text-white font-semibold flex-1 text-center py-0"
                value={editedTitle}
                onChangeText={setEditedTitle}
                maxLength={30}
              />
            ) : (
              <Text className="text-2xl text-white font-semibold flex-1 text-center">{notation?.title || "Loading..."}</Text>
            )}

            <View className="flex flex-row gap-2">
              <TouchableOpacity onPress={() => {
                if (isEditing) {
                  saveChanges();
                } 
                setIsEditing(!isEditing);
              }}>
                <MaterialIcons name={isEditing ? "save" : "edit"} size={26} color="#fff" />
              </TouchableOpacity>

              <Menu>
                <MenuTrigger>
                  <MaterialIcons name="more-vert" size={26} color="#fff" />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={handleDeletePress}>
                    <View className="flex flex-row items-center justify-center">
                      <MaterialIcons name="delete" size={18} color="red" />
                      <Text className="text-red-600 p-2">Deletar Anotação</Text>
                    </View>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 px-2" style={styles.notebookWrapper}>
          <NotebookBackground />
          {isEditing ? (
            <TextInput
              ref={textRef}
              style={styles.textInput}
              value={editedMessage}
              onChangeText={(text) => {
                setEditedMessage(text);
                calculateLines();
              }}
              multiline
              autoFocus
            />
          ) : (
            <Text 
              ref={textRef}
              style={styles.textInput}
            >
              {notation?.message || ""}
            </Text>
          )}
        </View>
      </ScrollView>

      <View className="bg-neutral-300 flex flex-row w-full justify-between items-center p-1">
        <Text className="text-sm text-neutral-800 font-medium">
          {isEditing ? "Alterações não Salvas" : "Atualizado"}
        </Text>
        <View className="flex flex-row gap-2">
          <Text className="text-sm text-neutral-900">{formatDate(notation?.updated_at || "")}</Text>
        </View>
      </View>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDeleteNotation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  notebookWrapper: {
    backgroundColor: '#fff',
    position: 'relative',
    minHeight: Dimensions.get('window').height * 0.6, // Altura mínima
  },
  notebookLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textInput: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  line: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#f7f7f7',
    left: 15,
    right: 15,
  },
});