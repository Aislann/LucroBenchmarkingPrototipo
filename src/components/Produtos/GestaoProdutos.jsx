import React, { useState, useEffect } from 'react';
import './Gestao.css';
import './InputRequisicao.css'
import './Requisicao.css'
import './Responsividade.css'
import './CadastroProd.css'
import deletar from '/src/assets/deletar.svg';
import editar from '/src/assets/editar.svg';
import enviarEmail from '/src/assets/enviarEmail.svg';
import PlayBench from '/src/assets/PlayBench.svg';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint } from '@fortawesome/free-solid-svg-icons';

const GestaoProdutos = () => {
  const [dadosDaApi, setDadosDaApi] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [idProdutoParaExcluir, setIdProdutoParaExcluir] = useState(null);
  const [nome, setNome] = useState('');
  const [resultadosLucro, setResultadosLucro] = useState({});
  const idProdutoLucro = 9001;
  const [benchmarkingAberto, setBenchmarkingAberto] = useState(false);
  const [resultadosLucroAberto, setResultadosLucroAberto] = useState(false);
  const [valorPagoFornecedor, setValorPagoFornecedor] = useState(0);


  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get('http://3.145.53.73:8002/api/GestaoProdutos');
  //     setDadosDaApi(response.data);
  //   } catch (error) {
  //     console.error('Erro ao buscar dados da API:', error);
  //   }
  // };
  
  const fetchData = async () => {
    try {
      const fakeData = [
        { idProduto: 1, descricao: 'Teclado USB' , preco: 26, estoqueAtual:30},
      ];
  
      setDadosDaApi(fakeData);
    } catch (error) {
      console.error('Erro ao buscar dados fictícios:', error);
    }
  };
  
  

  const handleDeletarProduto = async (idProduto, estadoProduto) => {
    try {

        await axios.delete(`http://3.145.53.73:8002/api/GestaoProdutos/${idProduto}`);
        const novosDados = dadosDaApi.filter(item => item.idProduto !== idProduto);
        setDadosDaApi(novosDados);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const handleConfirmarExclusao = async () => {
    if (idProdutoParaExcluir) {
      await handleDeletarProduto(idProdutoParaExcluir, dadosDaApi.find(item => item.idProduto === idProdutoParaExcluir).estado);
      setConfirmarExclusao(false);
      setIdProdutoParaExcluir(null);
    }
  };

  const handleCancelarExclusao = () => {
    setConfirmarExclusao(false);
    setIdProdutoParaExcluir(null);
  };

  const openConfirmarExclusaoModal = (idProduto) => {
      setIdProdutoParaExcluir(idProduto);
      setConfirmarExclusao(true);
  };

  // const handleEditarProduto = async (idProduto) => {
  //   try {
  //     const response = await axios.get(`http://3.145.53.73:8002/api/GestaoProdutos/${idProduto}`);
  //     setProdutoParaEditar(response.data);
  //     setModalIsOpen(true);
  //   } catch (error) {
  //     console.error('Erro ao obter informações do produto:', error);
  //   }
  // };
  const handleEditarProduto = async (idProduto) => {
    try {
      setModalIsOpen(true);
    } catch (error) {
      console.error('Erro ao obter informações do produto:', error);
    }
  };

  const handleEmail = async (idProduto) => {
    try {
      setProdutoSelecionado(idProduto);
      setModalEmail(true);
    } catch (error) {
      console.error('Erro ao obter informações do produto:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://3.145.53.73:8002/api/GestaoProdutos/${produtoParaEditar.idProduto}`, produtoParaEditar);
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  const handleEnviarEmail = async () => {
    try {
      await axios.get(`http://3.145.53.73:8002/api/GestaoProdutos/VerificarNovoProduto/${produtoSelecionado}`);
      console.log('Email enviado com sucesso.');
      closeModal();
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  };

  const closeModal = () => {
    setProdutoParaEditar(null);
    setModalIsOpen(false);
    setModalEmail(false);
  };

  const closeEmail = () => {
    setModalEmail(false);
  };

  useEffect(() => {
    axios.get('http://3.145.53.73:8002/api/Email')
      .then(response => {
        if (response.data.length > 0) {
          setEmail(response.data[0].emailUsuario);
        }
      })
      .catch(error => {
        console.error('Erro ao obter email:', error);
      });
  }, []);

  const handleCadastrarProduto = async (idProdutoLucro) => {
    try {
      const novoProduto = {
        idProduto: idProdutoLucro,
        descricao: nome,
        estoqueAtual: 50,
        estoqueMinimo: 10,
        estado: "play"
      };

      await axios.post('http://3.145.53.73:8002/api/GestaoProdutos', novoProduto);

      const response = await axios.get(`http://3.145.53.73:8002/api/GestaoProdutos/${idProdutoLucro}`);
      const produto = response.data;

      produto.preco = 700;

      await axios.patch(`http://3.145.53.73:8002/api/GestaoProdutos/${idProdutoLucro}`, produto);

      console.log('Preço atualizado com sucesso.');

    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  const calcularLucroPotencial = (produto) => {
    const precoVenda = produto.preco || 0;
    const precoCompra = produto.precoCompra || 0; 
    return precoVenda - precoCompra;
  };

  const calcularLucroTotal = () => {
    let lucroTotal = 0;
    dadosDaApi.forEach(produto => {
      lucroTotal += calcularLucroPotencial(produto);
    });
    return lucroTotal;
  };

  useEffect(() => {
    const lucroPorProduto = {};
    dadosDaApi.forEach(produto => {
      lucroPorProduto[produto.descricao] = calcularLucroPotencial(produto);
    });
    setResultadosLucro({
      lucroPorProduto,
      lucroTotal: calcularLucroTotal()
    });
  }, [dadosDaApi]);

  const calcularMargemLucro = (precoProduto, valorPagoFornecedor) => {
    const precoCompra = parseFloat(valorPagoFornecedor);
    if (!isNaN(precoCompra)) {
      const lucro = precoProduto - precoCompra;
      const margemLucro = (lucro / precoProduto) * 100;
      const lucroEmReais = lucro.toFixed(2);
      return { margemLucro: margemLucro.toFixed(2), lucroEmReais };
    } else {
      return 'Valor pago ao fornecedor inválido';
    }
  };

  function QuadradoPreenchido({ margemLucro }) {
    const [progresso, setProgresso] = useState(0);
  
    const atualizarProgresso = () => {
      const novoProgresso = Math.min(margemLucro, 100);
      setProgresso(novoProgresso);
    };
  
    useEffect(() => {
      atualizarProgresso();
    }, [margemLucro]);
  
    const estiloQuadrado = {
      width: '100px',
      backgroundColor: 'lightgreen',
      transition: 'width 0.5s ease-in-out',
    };

    estiloQuadrado.width = `${progresso}%`;
  
    return <div className='margem100' style={estiloQuadrado}>{calcularMargemLucro(dadosDaApi.find(item => item.idProduto === 1).preco, valorPagoFornecedor).margemLucro}%</div>;
  }
  
  

  return (
    <div>
      <div className="main">
        <div className="header">
          <span>Resultado de Pesquisa e Análise de Lucro</span>
        </div>
        <div className="conteudo">
          <div className="gestaoProdutos">
            <div className='header'>
              <span>Pesquisar Produto</span>
            </div>
            <div className="cadProd">
              {/* <input type="text" className='addProduto' placeholder='Nome do produto...' onChange={(e) => setNome(e.target.value)} /> */}
              <input type="text" className='addProduto' placeholder='Nome do produto...' value={'Teclado USB'} />
              <button>
                <img src={PlayBench} alt="PlayBench" onClick={() => handleCadastrarProduto(9001)} />
              </button>
            </div>
            {/* <section className="Benchmarking" > 
              <h3>Resultado do Benchmarking</h3>
              {!benchmarkingAberto && dadosDaApi
                .filter(item => item.idProduto === 9001)
                .map(item => (
                  <tr key={item.idProduto}>
                    <td>{item.descricao}: R$ {item.preco || '00.00'}</td>
                    <label htmlFor="">Valor pago com Fornecedor:</label>
                    <br />
                    <input type="text" value={valorPagoFornecedor} onChange={(e) => setValorPagoFornecedor(e.target.value)} />
                    <td className="icones">
                      <img src={enviarEmail} alt="Enviar Email" onClick={() => handleEmail(item.idProduto)} />
                      <img
                        src={editar}
                        alt="Editar"
                        onClick={() => handleEditarProduto(item.idProduto)}
                      />

                    </td>
                    
                  </tr>
                ))}
            </section> */}
            <section className="Benchmarking" > 
              <h3>Resultado do Benchmarking</h3>
              {!benchmarkingAberto && dadosDaApi
                .filter(item => item.idProduto === 1)
                .map(item => (
                  <tr key={item.idProduto}>
                    <td>{item.descricao}: R$ {item.preco || '00.00'}</td>
                    <label htmlFor="">Valor pago com Fornecedor:</label>
                    <br />
                    <input type="text" value={valorPagoFornecedor} onChange={(e) => setValorPagoFornecedor(e.target.value)} />
                    <td className="icones">
                      <img src={enviarEmail} alt="Enviar Email" onClick={() => handleEmail(item.idProduto)} />
                      <img
                        src={editar}
                        alt="Editar"
                        onClick={() => handleEditarProduto(item.idProduto)}
                      />

                    </td>
                    
                  </tr>
                ))}
            </section>
            {/* <section className="resultadosLucro" onClick={() => setResultadosLucroAberto(!resultadosLucroAberto)}>
            <h3>Análise de Lucro</h3>
            {resultadosLucroAberto && (
              <div>
                <span>
                  Lucro por Unidade: R$ {calcularMargemLucro(dadosDaApi.find(item => item.idProduto === 9001).preco, valorPagoFornecedor).lucroEmReais}
                  <br />
                  Lucro por Estoque: R$ {parseFloat(calcularMargemLucro(dadosDaApi.find(item => item.idProduto === 9001).preco, valorPagoFornecedor).lucroEmReais) * parseFloat(dadosDaApi.find(item => item.idProduto === 9001).estoqueAtual)}
                  <br />
                  Margem de Lucro: 
                  <br />
                  <QuadradoPreenchido margemLucro={calcularMargemLucro(dadosDaApi.find(item => item.idProduto === 9001).preco, valorPagoFornecedor).margemLucro} />
                </span>
              </div>
            )}
          </section> */}
          <section className="resultadosLucro" onClick={() => setResultadosLucroAberto(!resultadosLucroAberto)}>
            <h3>Análise de Lucro</h3>
            {resultadosLucroAberto && (
              <div>
                <span>
                  Lucro por Unidade: R$ {calcularMargemLucro(dadosDaApi.find(item => item.idProduto === 1).preco, valorPagoFornecedor).lucroEmReais}
                  <br />
                  Lucro por Estoque: R$ {parseFloat(calcularMargemLucro(dadosDaApi.find(item => item.idProduto === 1).preco, valorPagoFornecedor).lucroEmReais) * parseFloat(dadosDaApi.find(item => item.idProduto === 1).estoqueAtual)}
                  <br />
                  Margem de Lucro: 
                  <br />
                  <QuadradoPreenchido margemLucro={calcularMargemLucro(dadosDaApi.find(item => item.idProduto === 1).preco, valorPagoFornecedor).margemLucro} />
                </span>
              </div>
            )}
          </section>

            {dadosDaApi
                .filter(item => item.idProduto === 1)
                .map(item => (
                  <div className='limparSecao'>
                  <tr key={item.idProduto}>
                    <td className="icones">Limpar Seção
                      <img
                        src={deletar}
                        alt="Deletar"
                        onClick={() => openConfirmarExclusaoModal(item.idProduto)}
                      />
                    </td>
                  </tr>
                  </div>
                ))}
            {/* <Modal
              isOpen={modalIsOpen}
              contentLabel="Editar Produto"
              className="modal"
            >
              {produtoParaEditar && (
                <div>
                  <h2>Adicionar Estoque</h2>
                  <label>{produtoParaEditar.descricao}</label>
                  <label>Estoque Atual:</label>
                  <input
                    type="text"
                    id="descricao"
                    value={produtoParaEditar.estoqueAtual}
                    onChange={(e) => setProdutoParaEditar({ ...produtoParaEditar, estoqueAtual: e.target.value })}
                  />
                  <div>
                    <button className='salvar' onClick={handleSaveChanges}>Salvar Alterações</button>
                    <button className='fechar' onClick={closeModal}>Fechar</button>
                  </div>
                </div>
              )}
            </Modal> */}
            <Modal
              isOpen={modalIsOpen}
              contentLabel="Editar Produto"
              className="modal"
            >
                {dadosDaApi
                .filter(item => item.idProduto === 1)
                .map(item => (
                  <div>
                  <h2>Adicionar Estoque</h2>
                  <label>{item.descricao}</label>
                  <label>Estoque Atual:</label>
                  <input
                    type="text"
                    id="descricao"
                    value={item.estoqueAtual}
                  />
                  <div>
                    <button className='salvar' >Salvar Alterações</button>
                    <button className='fechar' onClick={closeModal}>Fechar</button>
                  </div>
                </div>
                ))}

            </Modal>
            <Modal
              isOpen={modalEmail}
              contentLabel="Editar Produto"
              className="modal"
            >
              <div>
                <h2>Email Cadastrado:</h2>
                <span>{email}</span>
                <div>
                  <button className='salvar' onClick={handleEnviarEmail}>Enviar Email</button>
                  <button className='fechar' onClick={closeEmail}>Fechar</button>
                </div>
              </div>
            </Modal>
            {confirmarExclusao && (
              <Modal
                isOpen={confirmarExclusao}
                contentLabel="Confirmar Exclusão"
                className="modal"
              >
                <div>
                  <h2>Confirmar Exclusão</h2>
                  <p>Tem certeza de que deseja excluir este produto?</p>
                  <div>
                    <button className='salvar' onClick={handleConfirmarExclusao}>Sim</button>
                    <button className='fechar' onClick={handleCancelarExclusao}>Cancelar</button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestaoProdutos;
