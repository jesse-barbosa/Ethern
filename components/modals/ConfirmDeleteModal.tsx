import { View, Text, Modal, TouchableOpacity } from 'react-native';

interface ConfirmDeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ visible, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-xl shadow-lg w-5/6">
          <Text className="text-2xl font-semibold text-center mt-2 mb-4">Tem certeza que deseja excluir este item?</Text>
          <Text className="text-md text-center text-neutral-500 mb-6">Não é possível restaurar o item após sua exclusão.</Text>
          <View className="flex-row justify-between">
            <View className="w-1/2 pe-2">
              <TouchableOpacity onPress={onCancel} className="bg-neutral-300 w-full px-4 py-3 rounded-lg">
                <Text className="text-black text-center">Cancelar</Text>
              </TouchableOpacity>
            </View>
            <View className="w-1/2 ps-2">
              <TouchableOpacity onPress={onConfirm} className="bg-red-500 w-full px-4 py-3 rounded-lg">
                <Text className="text-white text-center">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}