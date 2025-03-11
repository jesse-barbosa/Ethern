import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';

interface ConfirmActionModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (password: string, setLoading: (loading: boolean) => void) => void;
  action: 'delete' | 'save';
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({ visible, onCancel, onConfirm, action }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    setIsLoading(true);
    onConfirm(password, setIsLoading);
    setPassword('')
  };

  return (
    <Modal visible={visible} transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-5/6">
          <Text className="text-2xl font-semibold text-center mt-2 mb-4">
            Digite sua senha para confirmar
          </Text>

          <TextInput
            secureTextEntry
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            className="w-full border-b-2 border-neutral-300 py-2 mb-6 text-lg"
          />

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onCancel}
              disabled={isLoading}
              className="bg-neutral-300 w-1/2 px-4 py-3 rounded-lg"
            >
              <Text className="text-black text-center">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              className="bg-blue-500 w-1/2 px-4 py-3 rounded-lg flex-row justify-center"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center">
                  {action === 'delete' ? 'Excluir' : 'Salvar'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmActionModal;