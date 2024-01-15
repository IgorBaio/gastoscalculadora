// Importando os componentes necessários
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"

// Criando um componente para representar cada item da lista de gastos
const Item = ({ descricao, valor, categoria, removeItem }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.descricao}>{descricao}</Text>
      <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
      <Text style={styles.categoria}>{categoria}</Text>
      <TouchableOpacity style={styles.categoria} onPress={removeItem}>
        <Text>X</Text>
      </TouchableOpacity>
    </View>
  );
};

// Criando o componente principal do aplicativo
const App = () => {
  // Definindo os estados para armazenar os dados do usuário e da lista de gastos
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [gastos, setGastos] = useState([]);

  // Criando uma função para adicionar um novo gasto à lista
  const adicionarGasto = () => {
    // Validando os dados do usuário
    if (descricao && valor && categoria) {
      // Criando um objeto com os dados do gasto
      const gasto = {
        id: Math.random().toString(),
        descricao: descricao,
        valor: parseFloat(valor),
        categoria: categoria,
      };
      // Atualizando a lista de gastos com o novo gasto
      const newGastos = [...gastos, gasto]
      setGastos(newGastos);
      // Limpando os campos de entrada
      setDescricao("");
      setValor("");
      setCategoria("");
      AsyncStorage.setItem("@gastos", JSON.stringify(newGastos))
    } else {
      // Exibindo uma mensagem de erro se algum dado estiver faltando
      alert("Por favor, preencha todos os campos.");
    }
  };

  // Criando uma função para calcular o total de gastos
  const calcularTotal = () => {
    // Inicializando a variável que armazena o total
    let total = 0;
    // Percorrendo a lista de gastos e somando os valores
    for (let gasto of gastos) {
      total += gasto.valor;
    }
    // Retornando o total formatado
    return total.toFixed(2);
  };

  const removeGasto = (gasto) => {
    const newGastos = gastos?.filter(
      (g) => g?.id !== gasto?.id
    );

    setGastos(newGastos);
    AsyncStorage.setItem("@gastos", JSON.stringify(newGastos))

  };

  const getGastos = () => AsyncStorage.getItem("@gastos")

  useEffect(()=>{
    getGastos().then(gastosCache=>{
      console.log('gastosCache', gastosCache)
      if(!!gastosCache) setGastos(JSON.parse(gastosCache))

    })
  },[])

  // Retornando o JSX do componente
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Controle de Gastos</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor"
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
        />
        
      </View>
      <View style={styles.form}>
        
        <TextInput
          style={styles.input}
          placeholder="Categoria"
          value={categoria}
          onChangeText={setCategoria}
        />
        <Button title="Adicionar" onPress={adicionarGasto} />
      </View>
      <Text style={styles.total}>Total: R$ {calcularTotal()}</Text>
      <FlatList
        data={gastos}
        renderItem={({ item }) => (
          <Item {...item} removeItem={() => removeGasto(item)} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Definindo os estilos dos componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  form: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  descricao: {
    fontSize: 16,
    color: "#333",
  },
  valor: {
    fontSize: 16,
    color: "#f00",
  },
  categoria: {
    fontSize: 16,
    color: "#999",
  },
});

// Exportando o componente
export default App;
