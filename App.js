import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image } from 'react-native';

export default function App() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const pesquisarFilmes = async () => {
    if (!query.trim()) return;
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(
        `https://www.omdbapi.com/?apikey=7a8b8b65&s=${encodeURIComponent(query)}`
      );
      const dados = await resposta.json();
      if (dados.Response === 'True') {
        setResultados(dados.Search);
      } else {
        setResultados([]);
        setErro(dados.Error || 'Nenhum resultado encontrado.');
      }
    } catch (erro) {
      setErro('Erro na conexão com a API.');
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Pesquisa de Filmes</Text>
      <TextInput
        style={estilos.input}
        placeholder="Digite um filme"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Pesquisar" onPress={pesquisarFilmes} />
      {carregando && <Text>Carregando...</Text>}
      {erro && <Text style={estilos.erro}>{erro}</Text>}
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <View style={estilos.item}>
            {item.Poster !== 'N/A' && (
              <Image source={{ uri: item.Poster }} style={estilos.poster} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={estilos.tituloFilme}>{item.Title}</Text>
              <Text style={estilos.ano}>{item.Year}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tituloFilme: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ano: {
    fontSize: 14,
    color: '#555',
  },
  poster: {
    width: 50,
    height: 75,
    resizeMode: 'cover',
    marginRight: 10,
  },
  erro: {
    color: 'red',
    marginVertical: 8,
    textAlign: 'center',
  },
});
