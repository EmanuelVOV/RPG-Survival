// ============================================================
// O COFRE DAS SOMBRAS - Lógica Principal do Jogo
// Disciplina: Educação Financeira e Pensamento Lógico (8º B)
// ============================================================

// Configuração das 3 classes jogáveis
const CLASSES_DISPONIVEIS = {
  guardiao: {
    nome: "Guardião",
    vidaInicial: 120,
    moedasIniciais: 30,
    ataque: 10,
    defesa: 4,
    bonusBau: 0,
    bonusVitoria: 0,
    descricao: "Guardião: começa com 120 de vida e +2 de defesa extra contra armadilhas e monstros."
  },
  mercador: {
    nome: "Mercador",
    vidaInicial: 90,
    moedasIniciais: 65,
    ataque: 10,
    defesa: 2,
    bonusBau: 0,
    bonusVitoria: 10,
    descricao: "Mercador: começa com 65 moedas e ganha +10 moedas extras ao vencer desafios."
  },
  sabio: {
    nome: "Sábio",
    vidaInicial: 100,
    moedasIniciais: 45,
    ataque: 12,
    defesa: 2,
    bonusBau: 15,
    bonusVitoria: 0,
    descricao: "Sábio: começa com mais ataque e ganha +15 moedas de bônus ao decifrar baús misteriosos."
  }
};

// Descrições visuais da masmorra que fica mais escura e bizarra a cada nível
const NIVEIS_MASMORRA = [
  "Nível 1: Entrada de Pedra Úmida",
  "Nível 2: Corredor das Tochas Azuis",
  "Nível 3: Sala dos Espelhos Tortos",
  "Nível 4: Abismo dos Cogumelos Brilhantes",
  "Nível 5: Acampamento Subterrâneo do Goblin",
  "Nível 6: Galeria dos Relógios Derretidos",
  "Nível 7: Labirinto das Sombras Sussurrantes",
  "Nível 8: Salão dos Olhos na Parede",
  "Nível 9: Mercado Secreto das Profundezas",
  "Nível 10: O Cofre das Sombras (Chefe Final)"
];

// Estado atual da partida
const estadoJogo = {
  nomeHeroi: "Aventureiro",
  classeId: "guardiao",
  faseAtual: 1,
  totalFases: 10,
  vida: 120,
  vidaMaxima: 120,
  moedas: 30,
  ataque: 10,
  defesa: 4,
  acertos: 0,
  tempoInicio: 0,
  jogoFinalizado: false
};

// Referências aos elementos da tela
const elTelaInicial = document.getElementById("tela-inicial");
const elTelaJogo = document.getElementById("tela-jogo");
const elTelaFinal = document.getElementById("tela-final");

const elCampoNome = document.getElementById("campo-nome");
const elBotoesClasse = document.querySelectorAll(".botao-classe");
const elDescricaoClasse = document.getElementById("descricao-classe-selecionada");
const elBotaoComecar = document.getElementById("botao-comecar");
const elBotaoTema = document.getElementById("botao-tema");

const elInfoHeroi = document.getElementById("info-heroi");
const elInfoFase = document.getElementById("info-fase");
const elInfoVida = document.getElementById("info-vida");
const elInfoMoedas = document.getElementById("info-moedas");
const elInfoAtributos = document.getElementById("info-atributos");

const elEtiquetaProfundidade = document.getElementById("etiqueta-profundidade");
const elIlustracaoEvento = document.getElementById("ilustracao-evento");
const elTituloEvento = document.getElementById("titulo-evento");
const elDescricaoEvento = document.getElementById("descricao-evento");
const elListaOpcoes = document.getElementById("lista-opcoes");

const elCaixaFeedback = document.getElementById("caixa-feedback");
const elTextoFeedback = document.getElementById("texto-feedback");
const elBotaoProximo = document.getElementById("botao-proximo");

const elTituloFinal = document.getElementById("titulo-final");
const elMensagemFinal = document.getElementById("mensagem-final");
const elResumoPontuacao = document.getElementById("resumo-pontuacao");
const elBotaoReiniciar = document.getElementById("botao-reiniciar");

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

// Sorteia um número inteiro de moedas entre 20 e 75
function sortearMoedas(minimo = 20, maximo = 75) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

// Avisa o portal sobre a altura atual da tela
function notificarAlturaPortal() {
  const alturaDocumento = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
  window.parent.postMessage({ type: "vrgame:resize", height: alturaDocumento }, "*");
}

// Alterna entre tema claro e escuro
function aplicarTema(novoTema) {
  const temaValido = novoTema === "light" ? "light" : "dark";
  document.body.setAttribute("data-theme", temaValido);
  notificarAlturaPortal();
}

// Cria ilustrações geométricas simples em SVG conforme o tipo de fase
function obterIlustracaoSVG(tipo) {
  if (tipo === "bau") {
    return `
      <svg width="88" height="68" viewBox="0 0 88 68" aria-hidden="true">
        <rect x="14" y="24" width="60" height="36" rx="6" fill="#8c5319" stroke="#f5b942" stroke-width="3"/>
        <path d="M14 28 Q44 10 74 28" fill="#a86420" stroke="#f5b942" stroke-width="3"/>
        <rect x="38" y="26" width="12" height="14" rx="2" fill="#f5b942"/>
        <circle cx="44" cy="33" r="2.5" fill="#1b1d29"/>
      </svg>
    `;
  }
  if (tipo === "goblin") {
    return `
      <svg width="88" height="68" viewBox="0 0 88 68" aria-hidden="true">
        <polygon points="18,32 6,22 18,42" fill="#4cd137"/>
        <polygon points="70,32 82,22 70,42" fill="#4cd137"/>
        <circle cx="44" cy="34" r="22" fill="#44bd32" stroke="#f5b942" stroke-width="2.5"/>
        <circle cx="36" cy="30" r="3.5" fill="#fff200"/>
        <circle cx="52" cy="30" r="3.5" fill="#fff200"/>
        <path d="M35 44 Q44 50 53 44" fill="none" stroke="#1b1d29" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `;
  }
  if (tipo === "chefe") {
    return `
      <svg width="96" height="72" viewBox="0 0 96 72" aria-hidden="true">
        <polygon points="24,22 16,6 34,16" fill="#ff4757"/>
        <polygon points="72,22 80,6 62,16" fill="#ff4757"/>
        <circle cx="48" cy="38" r="25" fill="#2f1124" stroke="#ff4757" stroke-width="3"/>
        <circle cx="38" cy="33" r="4" fill="#ff6b81"/>
        <circle cx="58" cy="33" r="4" fill="#ff6b81"/>
        <circle cx="48" cy="23" r="3" fill="#ffeaa7"/>
        <polygon points="36,48 42,43 48,48 54,43 60,48 54,53 42,53" fill="#ff4757"/>
      </svg>
    `;
  }
  // Ilustração padrão de enigma/monstro da masmorra
  return `
    <svg width="88" height="68" viewBox="0 0 88 68" aria-hidden="true">
      <polygon points="44,8 74,56 14,56" fill="#342b52" stroke="#a29bfe" stroke-width="3"/>
      <circle cx="44" cy="38" r="9" fill="#ffeaa7"/>
      <circle cx="44" cy="38" r="4" fill="#1b1d29"/>
    </svg>
  `;
}

// ============================================================
// GERADOR DE DESAFIOS DAS 10 FASES
// ============================================================

function criarDesafioDaFase(fase) {
  const recompensaAleatoria = sortearMoedas(20, 75);
  const infoClasse = CLASSES_DISPONIVEIS[estadoJogo.classeId];

  // FASES 5 E 9: LOJA DO GOBLIN MERCADOR
  if (fase === 5 || fase === 9) {
    const ehSegundaLoja = fase === 9;
    const itensLoja = ehSegundaLoja
      ? [
          {
            nome: "Espada Rúnica (+8 Ataque) + Poção (+25 Vida)",
            preco: 65,
            detalhe: "Pacote completo antes do Chefe Final! Custa 65 moedas.",
            efeito: () => {
              estadoJogo.ataque += 8;
              estadoJogo.vida = Math.min(estadoJogo.vidaMaxima, estadoJogo.vida + 25);
            },
            explicacao: "Ótimo planejamento! Guardar moedas para comprar o pacote completo antes do chefe aumenta muito suas chances de vitória."
          },
          {
            nome: "Escudo Sombrio (+5 Defesa)",
            preco: 40,
            detalhe: "Reduz bastante o dano do Chefe Final. Custa 40 moedas.",
            efeito: () => {
              estadoJogo.defesa += 5;
            },
            explicacao: "Boa escolha! Como você tinha 40 moedas ou mais, investiu na sua defesa sem gastar além do orçamento."
          },
          {
            nome: "Tônico de Emergência (+35 Vida)",
            preco: 25,
            detalhe: "Opção econômica para recuperar energia. Custa 25 moedas.",
            efeito: () => {
              estadoJogo.vida = Math.min(estadoJogo.vidaMaxima, estadoJogo.vida + 35);
            },
            explicacao: "Escolha prudente! Quando o orçamento está apertado, recuperar vida garante sobrevivência na batalha final."
          }
        ]
      : [
          {
            nome: "Kit Aventureiro: Adaga (+4 Ataque) + Escudo (+2 Defesa)",
            preco: 50,
            detalhe: "Promoção: comprados separados custariam 65 moedas! Custa 50 moedas.",
            efeito: () => {
              estadoJogo.ataque += 4;
              estadoJogo.defesa += 2;
            },
            explicacao: "Excelente custo-benefício! O pacote custa 50 moedas em vez de 65, gerando uma economia de 15 moedas."
          },
          {
            nome: "Lâmina Afiada (+4 Ataque)",
            preco: 30,
            detalhe: "Aumenta seu dano nas próximas fases. Custa 30 moedas.",
            efeito: () => {
              estadoJogo.ataque += 4;
            },
            explicacao: "Compra equilibrada! Você melhorou seu ataque mantendo moedas de reserva para o futuro."
          },
          {
            nome: "Poção Menor (+25 Vida)",
            preco: 20,
            detalhe: "Recupera vida gastando pouco. Custa 20 moedas.",
            efeito: () => {
              estadoJogo.vida = Math.min(estadoJogo.vidaMaxima, estadoJogo.vida + 25);
            },
            explicacao: "Boa decisão econômica! Você recuperou energia sem comprometer todo o seu dinheiro."
          }
        ];

    const opcoesLoja = itensLoja.map((item) => {
      const podeComprar = estadoJogo.moedas >= item.preco;
      return {
        texto: `${item.nome} — ${item.preco} moedas`,
        subtexto: podeComprar
          ? item.detalhe
          : `Saldo insuficiente (você tem ${estadoJogo.moedas} moedas).`,
        desabilitado: !podeComprar,
        aoEscolher: () => {
          estadoJogo.moedas -= item.preco;
          item.efeito();
          estadoJogo.acertos += 1;
          return {
            acertou: true,
            mensagem: `Compra realizada por ${item.preco} moedas! ${item.explicacao}`
          };
        }
      };
    });

    // Opção de não gastar nada e poupar moedas
    opcoesLoja.push({
      texto: "Não comprar nada e guardar moedas",
      subtexto: "Economiza seu dinheiro atual (ganha +10 moedas de juros por poupar).",
      desabilitado: false,
      aoEscolher: () => {
        estadoJogo.moedas += 10;
        estadoJogo.acertos += 1;
        return {
          acertou: true,
          mensagem: "Você decidiu poupar seu dinheiro! Guardar recursos para momentos mais críticos também é uma estratégia financeira inteligente (+10 moedas)."
        };
      }
    });

    return {
      tipo: "goblin",
      titulo: ehSegundaLoja ? "Goblin Mercador: Última Parada!" : "Goblin Mercador Apareceu!",
      descricao: `O Goblin abre sua mochila brilhante: "Você tem ${estadoJogo.moedas} moedas. Escolha com sabedoria o que cabe no seu bolso!"`,
      opcoes: opcoesLoja
    };
  }

  // FASE 10: CHEFE FINAL
  if (fase === 10) {
    const poderTotalHeroi = estadoJogo.ataque * 2 + estadoJogo.defesa * 2;
    const forcaChefe = 34;

    return {
      tipo: "chefe",
      titulo: "Chefe Final: O Guardião Abissal do Cofre",
      descricao: `Uma criatura colossal de sombras bloqueia o Cofre! Seu poder atual (Ataque + Defesa combinados) é ${poderTotalHeroi} contra ${forcaChefe} do Chefe. Como você vai agir?`,
      opcoes: [
        {
          texto: "Atacar usando seus equipamentos e estratégia",
          subtexto: "Usa toda a força dos itens que você comprou na masmorra.",
          desabilitado: false,
          aoEscolher: () => {
            if (poderTotalHeroi >= forcaChefe) {
              estadoJogo.acertos += 1;
              estadoJogo.moedas += 100;
              return {
                acertou: true,
                mensagem: `Vitória épica! Seus equipamentos garantiram poder ${poderTotalHeroi} contra ${forcaChefe} do Chefe. Planejar suas compras valeu a pena!`
              };
            } else {
              const danoRecebido = Math.max(25, (forcaChefe - poderTotalHeroi) * 4);
              estadoJogo.vida = Math.max(0, estadoJogo.vida - danoRecebido);
              if (estadoJogo.vida > 0) {
                estadoJogo.acertos += 1;
                return {
                  acertou: true,
                  mensagem: `Você resistiu por pouco! Faltou equipamento (poder ${poderTotalHeroi} vs ${forcaChefe}), então perdeu ${danoRecebido} de vida, mas sobreviveu e venceu o Chefe!`
                };
              }
              return {
                acertou: false,
                mensagem: `Seu poder (${poderTotalHeroi}) não foi suficiente contra o Chefe (${forcaChefe}) e sua vida chegou a zero. Investir melhor nas lojas do Goblin ajuda a vencer!`
              };
            }
          }
        },
        {
          texto: "Tentar subornar o Chefe com 80 moedas",
          subtexto: "Entrega 80 moedas para passar sem lutar (exige ter 80 moedas).",
          desabilitado: estadoJogo.moedas < 80,
          aoEscolher: () => {
            estadoJogo.moedas -= 80;
            estadoJogo.acertos += 1;
            return {
              acertou: true,
              mensagem: "Reserva de emergência salva o dia! Como você poupou 80 moedas, negociou sua passagem sem precisar lutar."
            };
          }
        }
      ]
    };
  }

  // FASES DE BAÚ MISTERIOSO (Fases 2, 4, 7)
  if (fase === 2 || fase === 4 || fase === 7) {
    const enigmasBau = {
      2: {
        pergunta: "Um baú tem 3 cadeados. O código segue a sequência: 5, 10, 20, 40, __. Qual número abre o baú?",
        opcoes: [
          { label: "80", correta: true, motivo: "Correto! Cada número dobra o anterior (40 × 2 = 80)." },
          { label: "50", correta: false, motivo: "Incorreto! A sequência dobra a cada passo, não soma 10." }
        ]
      },
      4: {
        pergunta: "Você tem 45 moedas. Quer comprar 2 poções de 18 moedas cada. Quanto vai sobrar de troco?",
        opcoes: [
          { label: "9 moedas", correta: true, motivo: "Correto! 2 × 18 = 36 moedas gastas; 45 - 36 = 9 moedas de troco." },
          { label: "17 moedas", correta: false, motivo: "Incorreto! 2 poções de 18 custam 36 moedas, sobrando 9 de 45." }
        ]
      },
      7: {
        pergunta: "Um item custa 60 moedas, mas está com 50% de desconto (metade do preço). Quanto você paga?",
        opcoes: [
          { label: "30 moedas", correta: true, motivo: "Correto! 50% significa metade: 60 ÷ 2 = 30 moedas." },
          { label: "10 moedas", correta: false, motivo: "Incorreto! 50% de desconto tira metade do valor (30), não 50 moedas." }
        ]
      }
    };

    const desafioAtual = enigmasBau[fase];
    const moedasSeguras = 20;
    const moedasDobro = recompensaAleatoria + infoClasse.bonusBau;

    const opcoesBau = [
      {
        texto: `Pegar o saco pequeno ao lado (+${moedasSeguras} moedas seguras)`,
        subtexto: "Sem risco de armadilha, mas ganha menos moedas.",
        desabilitado: false,
        aoEscolher: () => {
          estadoJogo.moedas += moedasSeguras;
          estadoJogo.acertos += 1;
          return {
            acertou: true,
            mensagem: `Escolha cautelosa! Você evitou riscos e garantiu ${moedasSeguras} moedas para seu orçamento.`
          };
        }
      }
    ];

    desafioAtual.opcoes.forEach((alt) => {
      opcoesBau.push({
        texto: `Abrir Baú Misterioso respondendo: ${alt.label}`,
        subtexto: `Risco e recompensa: ganha +${moedasDobro} moedas se acertar ou perde vida se errar.`,
        desabilitado: false,
        aoEscolher: () => {
          if (alt.correta) {
            estadoJogo.moedas += moedasDobro;
            estadoJogo.acertos += 1;
            return {
              acertou: true,
              mensagem: `${alt.motivo} Você abriu o baú e ganhou +${moedasDobro} moedas!`
            };
          } else {
            const dano = Math.max(12, 26 - estadoJogo.defesa);
            estadoJogo.vida = Math.max(0, estadoJogo.vida - dano);
            return {
              acertou: false,
              mensagem: `${alt.motivo} A armadilha disparou e você perdeu ${dano} de vida!`
            };
          }
        }
      });
    });

    return {
      tipo: "bau",
      titulo: `Baú Misterioso no Nível ${fase}`,
      descricao: `Você encontrou um baú trancado com uma charada: "${desafioAtual.pergunta}"`,
      opcoes: opcoesBau
    };
  }

  // FASES DE COMBATE E DECISÃO LÓGICA (Fases 1, 3, 6, 8)
  const desafiosMasmorra = {
    1: {
      titulo: "Morcego Guardião da Entrada",
      descricao: "Para passar sem ser atacado, decifre a lógica: 'Todo morcego da caverna voa. Zumbi não voa. Logo, Zumbi...'",
      alternativas: [
        {
          texto: "Não é um morcego da caverna",
          subtexto: "Dedução lógica por eliminação.",
          correta: true,
          explicacao: "Exato! Se todo morcego da caverna voa e Zumbi não voa, ele não pode ser um morcego da caverna."
        },
        {
          texto: "É um morcego que está dormindo",
          subtexto: "Suposição sem base na regra.",
          correta: false,
          explicacao: "Não! A regra diz que TODO morcego da caverna voa, sem exceções."
        }
      ]
    },
    3: {
      titulo: "Enigma das Duas Portas",
      descricao: "A placa diz: 'A porta da esquerda leva a um monstro. A porta da direita NÃO leva a um tesouro vazio.' Qual porta escolher?",
      alternativas: [
        {
          texto: "Porta da direita",
          subtexto: "Analisa a dupla negação da frase.",
          correta: true,
          explicacao: "Muito bem! 'Não leva a um tesouro vazio' significa que o tesouro está cheio e seguro."
        },
        {
          texto: "Porta da esquerda",
          subtexto: "Ignora o aviso da placa.",
          correta: false,
          explicacao: "Cuidado! A placa avisou claramente que havia um monstro na esquerda."
        }
      ]
    },
    6: {
      titulo: "Espectro do Custo-Benefício",
      descricao: "Um espectro bloqueia a ponte e pergunta: 'Qual oferta dá mais poções por menos moedas?'",
      alternativas: [
        {
          texto: "3 poções por 30 moedas (10 moedas cada)",
          subtexto: "Calcula o preço unitário antes de decidir.",
          correta: true,
          explicacao: "Perfeito! Dividindo 30 por 3, cada poção sai por 10 moedas, mais barato que 15 moedas cada."
        },
        {
          texto: "2 poções por 30 moedas (15 moedas cada)",
          subtexto: "Escolhe sem calcular o valor de cada unidade.",
          correta: false,
          explicacao: "Incorreto! Pelo mesmo valor de 30 moedas, a outra opção entrega 1 poção a mais."
        }
      ]
    },
    8: {
      titulo: "Sentinela das Sombras Profundas",
      descricao: "A criatura exige que você complete o padrão lógico: 100, 85, 70, 55, __.",
      alternativas: [
        {
          texto: "40",
          subtexto: "Identifica a subtração constante de 15.",
          correta: true,
          explicacao: "Acertou! A sequência diminui de 15 em 15 (55 - 15 = 40)."
        },
        {
          texto: "45",
          subtexto: "Subtrai apenas 10 no último passo.",
          correta: false,
          explicacao: "Errou! De 100 para 85, 85 para 70 e 70 para 55, a diferença é sempre 15."
        }
      ]
    }
  };

  const desafio = desafiosMasmorra[fase];
  const ganhoTotal = recompensaAleatoria + infoClasse.bonusVitoria;

  return {
    tipo: "enigma",
    titulo: desafio.titulo,
    descricao: desafio.descricao,
    opcoes: desafio.alternativas.map((alt) => ({
      texto: alt.texto,
      subtexto: alt.subtexto,
      desabilitado: false,
      aoEscolher: () => {
        if (alt.correta) {
          estadoJogo.moedas += ganhoTotal;
          estadoJogo.acertos += 1;
          return {
            acertou: true,
            mensagem: `${alt.explicacao} Você derrotou o perigo e coletou +${ganhoTotal} moedas!`
          };
        } else {
          const dano = Math.max(12, 28 - estadoJogo.defesa);
          estadoJogo.vida = Math.max(0, estadoJogo.vida - dano);
          return {
            acertou: false,
            mensagem: `${alt.explicacao} Você sofreu ${dano} de dano!`
          };
        }
      }
    }))
  };
}

// ============================================================
// ATUALIZAÇÃO DA INTERFACE E FLUXO DO JOGO
// ============================================================

function atualizarBarraStatus() {
  elInfoHeroi.textContent = estadoJogo.nomeHeroi;
  elInfoFase.textContent = `${estadoJogo.faseAtual} / ${estadoJogo.totalFases}`;
  elInfoVida.textContent = `${estadoJogo.vida}/${estadoJogo.vidaMaxima}`;
  elInfoMoedas.textContent = `${estadoJogo.moedas}`;
  elInfoAtributos.textContent = `⚔️ ${estadoJogo.ataque} | 🛡️ ${estadoJogo.defesa}`;

  // Atualiza o clima visual da masmorra conforme a profundidade
  document.body.setAttribute("data-profundidade", String(estadoJogo.faseAtual));
  elEtiquetaProfundidade.textContent = NIVEIS_MASMORRA[estadoJogo.faseAtual - 1];
}

function carregarFaseAtual() {
  atualizarBarraStatus();
  elCaixaFeedback.classList.add("oculto");
  elCaixaFeedback.classList.remove("acerto", "erro");
  elListaOpcoes.innerHTML = "";

  const evento = criarDesafioDaFase(estadoJogo.faseAtual);
  elIlustracaoEvento.innerHTML = obterIlustracaoSVG(evento.tipo);
  elTituloEvento.textContent = evento.titulo;
  elDescricaoEvento.textContent = evento.descricao;

  evento.opcoes.forEach((opcao) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-opcao";
    botao.disabled = Boolean(opcao.desabilitado);
    botao.innerHTML = `
      <span>${opcao.texto}</span>
      <small>${opcao.subtexto}</small>
    `;

    botao.addEventListener("click", () => {
      // Desativa todos os botões após a escolha para evitar clique duplo
      const todosBotoes = elListaOpcoes.querySelectorAll("button");
      todosBotoes.forEach((b) => {
        b.disabled = true;
      });

      const resultado = opcao.aoEscolher();
      atualizarBarraStatus();

      elTextoFeedback.textContent = resultado.mensagem;
      elCaixaFeedback.classList.remove("oculto");
      elCaixaFeedback.classList.add(resultado.acertou ? "acerto" : "erro");

      if (estadoJogo.vida <= 0) {
        elBotaoProximo.textContent = "Ver Resultado";
      } else if (estadoJogo.faseAtual >= estadoJogo.totalFases) {
        elBotaoProximo.textContent = "Concluir Masmorra";
      } else {
        elBotaoProximo.textContent = "Avançar para Próxima Fase";
      }

      notificarAlturaPortal();
    });

    elListaOpcoes.appendChild(botao);
  });

  notificarAlturaPortal();
}

function finalizarPartida(venceu) {
  if (estadoJogo.jogoFinalizado) return;
  estadoJogo.jogoFinalizado = true;

  elTelaJogo.classList.add("oculto");
  elTelaFinal.classList.remove("oculto");

  const tempoEmMs = Math.max(1000, Date.now() - estadoJogo.tempoInicio);
  const pontuacaoFinal = Math.max(
    0,
    estadoJogo.acertos * 100 + estadoJogo.moedas + (venceu ? 200 : 0)
  );
  const pontuacaoMaxima = 1500;

  if (venceu) {
    elTituloFinal.textContent = `Vitória! ${estadoJogo.nomeHeroi} conquistou o Cofre!`;
    elMensagemFinal.textContent =
      "Você atravessou os 10 níveis da masmorra sombria, tomou boas decisões financeiras e derrotou o Chefe Final!";
  } else {
    elTituloFinal.textContent = "Fim de Jogo na Masmorra";
    elMensagemFinal.textContent =
      "Sua vida chegou a zero antes de completar a jornada. Tente equilibrar melhor os riscos dos baús e os itens do Goblin!";
  }

  elResumoPontuacao.innerHTML = `
    <p><strong>Herói:</strong> ${estadoJogo.nomeHeroi} (${CLASSES_DISPONIVEIS[estadoJogo.classeId].nome})</p>
    <p><strong>Fase alcançada:</strong> ${estadoJogo.faseAtual} de ${estadoJogo.totalFases}</p>
    <p><strong>Moedas finais:</strong> ${estadoJogo.moedas}</p>
    <p><strong>Pontuação total:</strong> ${pontuacaoFinal} pontos</p>
  `;

  // Envia o resultado final para o portal conforme o contrato
  window.parent.postMessage(
    {
      type: "vrgame:finish",
      score: pontuacaoFinal,
      maxScore: pontuacaoMaxima,
      timeMs: tempoEmMs,
      detail: { jogo: "o-cofre-das-sombras" }
    },
    "*"
  );

  notificarAlturaPortal();
}

function iniciarNovoJogo() {
  const nomeDigitado = elCampoNome.value.trim();
  estadoJogo.nomeHeroi = nomeDigitado !== "" ? nomeDigitado : "Aventureiro";

  const classeEscolhida = CLASSES_DISPONIVEIS[estadoJogo.classeId];
  estadoJogo.faseAtual = 1;
  estadoJogo.vida = classeEscolhida.vidaInicial;
  estadoJogo.vidaMaxima = classeEscolhida.vidaInicial;
  estadoJogo.moedas = classeEscolhida.moedasIniciais;
  estadoJogo.ataque = classeEscolhida.ataque;
  estadoJogo.defesa = classeEscolhida.defesa;
  estadoJogo.acertos = 0;
  estadoJogo.tempoInicio = Date.now();
  estadoJogo.jogoFinalizado = false;

  elTelaInicial.classList.add("oculto");
  elTelaFinal.classList.add("oculto");
  elTelaJogo.classList.remove("oculto");

  carregarFaseAtual();
}

// ============================================================
// EVENTOS DE BOTÕES E COMUNICAÇÃO COM O PORTAL
// ============================================================

// Seleção de classe na tela inicial
elBotoesClasse.forEach((botao) => {
  botao.addEventListener("click", () => {
    elBotoesClasse.forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");

    const id = botao.getAttribute("data-classe");
    if (CLASSES_DISPONIVEIS[id]) {
      estadoJogo.classeId = id;
      elDescricaoClasse.textContent = CLASSES_DISPONIVEIS[id].descricao;
    }
  });
});

// Botão de começar aventura
elBotaoComecar.addEventListener("click", iniciarNovoJogo);

// Botão de avançar fase ou finalizar
elBotaoProximo.addEventListener("click", () => {
  if (estadoJogo.vida <= 0) {
    finalizarPartida(false);
    return;
  }

  if (estadoJogo.faseAtual >= estadoJogo.totalFases) {
    finalizarPartida(true);
    return;
  }

  estadoJogo.faseAtual += 1;
  carregarFaseAtual();
});

// Botão de jogar novamente
elBotaoReiniciar.addEventListener("click", () => {
  document.body.setAttribute("data-profundidade", "1");
  elTelaFinal.classList.add("oculto");
  elTelaInicial.classList.remove("oculto");
  notificarAlturaPortal();
});

// Botão manual de tema claro/escuro
elBotaoTema.addEventListener("click", () => {
  const temaAtual = document.body.getAttribute("data-theme");
  aplicarTema(temaAtual === "dark" ? "light" : "dark");
});

// Escuta mensagens enviadas pelo portal (tema e tela cheia)
window.addEventListener("message", (evento) => {
  const dados = evento.data;
  if (!dados || typeof dados !== "object") return;

  if (dados.type === "vrgame:theme") {
    const temaRecebido = dados.theme || dados.value;
    if (temaRecebido === "light" || temaRecebido === "dark") {
      aplicarTema(temaRecebido);
    }
  }

  if (dados.type === "vrgame:fullscreen") {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    notificarAlturaPortal();
  }
});

// Atualiza altura sempre que a janela mudar de tamanho
window.addEventListener("resize", notificarAlturaPortal);

// Avisa o portal que o jogo carregou e está pronto
window.addEventListener("DOMContentLoaded", () => {
  window.parent.postMessage({ type: "vrgame:ready" }, "*");
  notificarAlturaPortal();
});