export class RecintosZoo {

    //inicializando os atributos, recinto é a lista de objetos que representam os recintos do zoológico, e animais é um objeto que mapeia espécies e suas características.


    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];
  
        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }
  
    calcularOcupacao(animaisNoRecinto) {
        let ocupacao = 0;
        for (const animal of animaisNoRecinto) {
            ocupacao += animal.quantidade * this.animais[animal.especie].tamanho;
        }
        return ocupacao;
    }

    analisaRecintos(especie, quantidade) {
        

        //esse trecho está verificando se um animal de uma determinada espécie existe na coleção animais.
        if (!this.animais[especie]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }
        
        //informa se a quantidade for menor ou igual a zero, é uma quantidade inválida.
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }
        
        //animal agora contém os dados do animal da espécie especificada
        const animal = this.animais[especie];

        
        const tamanhoTotalNecessario = quantidade * animal.tamanho;
                
        const recintosViaveis = [];
        
        
        for (const recinto of this.recintos) {
            const { bioma, tamanho, animais: animaisNoRecinto } = recinto;
    
            // Verificar se o bioma é compatível
            if (!animal.biomas.includes(bioma) && !(bioma === 'savana e rio' && animal.biomas.includes('savana'))) {
                continue;
            }
  
            // Verificar convivência de carnívoros
            const hasCarnivoro = animaisNoRecinto.some(animal => this.animais[animal.especie].carnivoro);
            if (hasCarnivoro && especie !== animaisNoRecinto[0].especie) {
                continue; // Recinto com carnívoro existente, não pode adicionar outra espécie
            }
  
            // Regra: Macaco não pode ficar sozinho no recinto
            if (especie === 'MACACO' && animaisNoRecinto.length === 0 && quantidade < 2) {
                continue; // Macaco não pode ficar sozinho
            }
  
            const ocupacaoAtual = this.calcularOcupacao(animaisNoRecinto);
            const ocupacaoExtra = (animaisNoRecinto.length > 0 && animaisNoRecinto[0].especie !== especie) ? 1 : 0;
            const espacoLivre = tamanho - ocupacaoAtual - ocupacaoExtra;

            if (espacoLivre >= tamanhoTotalNecessario) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - tamanhoTotalNecessario} total: ${tamanho})`);
            }
        }
  
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }
    
        return { recintosViaveis };
    }
  }