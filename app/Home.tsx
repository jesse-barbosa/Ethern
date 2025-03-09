import { ScrollView, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function Home() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <ScrollView>
      <View>
        <Text className="font-extrabold">Hello World!</Text>
        <Text>User: { user?.name } </Text>
        <Text>Email: { user?.email } </Text>
      </View>
    </ScrollView>
  );
}