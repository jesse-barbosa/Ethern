import { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'lucide-react-native';

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  action: string;
  onConfirm: (title: string, message: string) => void;
  editTitle?: string;
  editMessage?: string;
}

export default function TaskModal({ visible, onCancel, action, onConfirm, editTitle, editMessage }: TaskModalProps) {
  const [title, setTitle] = useState(editTitle || '');
  const [message, setMessage] = useState(editMessage || '');
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    setTitle(editTitle || '');
    setMessage(editMessage || '');
    setIsChanged(false);
  }, [editTitle, editMessage]);
  
  useEffect(() => {
    if (title !== editTitle || message !== editMessage) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [title, message, editTitle, editMessage]);
  

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-xl shadow-lg mx-4">
        <View className="flex flex-row justify-between">
          <Text className="text-2xl font-semibold text-center">{action === "edit" ? "Atualizar Tarefa" : "Criar Tarefa"}</Text>
          <TouchableOpacity onPress={onCancel} className="">
                <X size={32} color={'#000'} />
            </TouchableOpacity>
        </View>
          {/* Inputs */}
          <View className="my-8">
          {/* Input - Título */}
          <View className="w-full max-w-md flex flex-row gap-3 items-center border-neutral-500 border-b-2">
            <TextInput
              placeholder="Título"
              className="flex-1 text-lg text-neutral-800 py-5"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setIsChanged(true);
              }}
            />
          </View>

          {/* Input - Mensagem */}
          <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2">
            <TextInput
              placeholder="Descrição (opcional)"
              className="flex-1 text-lg text-neutral-800 py-5"
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                setIsChanged(true);
              }}
            />
          </View>
        </View>
        <View className="flex-row justify-between">
          <TouchableOpacity 
          onPress={() => onConfirm(title, message)} 
          disabled={!isChanged} 
          className={`${isChanged ? "opacity-100" : "opacity-70"} bg-blue-500 w-full px-4 py-3 rounded-lg`}>
            <Text className="text-white text-xl text-center font-semibold">
              {action === "edit" ? "ATUALIZAR" : "CRIAR"}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </Modal>
  );
}