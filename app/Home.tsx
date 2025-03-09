import { ScrollView, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Header from "../components/Header";
import Menu from "../components/Menu";

export default function Home() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <View className="flex-1">
      <ScrollView>
      <Header />
        <View>
          <Text className="font-extrabold">Hello World!</Text>
          <Text>User: { user?.name } </Text>
          <Text>Email: { user?.email } </Text>
        </View>
      </ScrollView>
      <Menu />
    </View>
  );
}