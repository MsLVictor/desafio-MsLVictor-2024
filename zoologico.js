class Animal {
    constructor(especie, tamanho, biomas) {
        this.especie = especie;
        this.tamanho = tamanho;
        this.biomas = biomas;
    }
}

class Recinto {
    constructor(numero, bioma, tamanhoTotal, animaisExistentes) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.animaisExistentes = animaisExistentes;
    }
}

class Zoologico {
    constructor() {
        this.recintos = [
            new Recinto(1, "savana", 10, ["macaco", "macaco", "macaco"]),
            new Recinto(2, "floresta", 5, []),
            new Recinto(3, "savana e rio", 7, ["gazela"]),
            new Recinto(4, "rio", 8, []),
            new Recinto(5, "savana", 9, ["leao"])
        ];
        this.animais = {
            "LEAO": new Animal("LEAO", 3, ["savana"]),
            "LEOPARDO": new Animal("LEOPARDO", 2, ["savana"]),
            "CROCODILO": new Animal("CROCODILO", 3, ["rio"]),
            "MACACO": new Animal("MACACO", 1, ["savana", "floresta"]),
            "GAZELA": new Animal("GAZELA", 2, ["savana"]),
            "HIPOPOTAMO": new Animal("HIPOPOTAMO", 4, ["savana", "rio"])
        };
    }

    encontrarRecintosViaveis(especie, quantidade) {
        if (!this.animais[especie]) {
            return "Animal inválido";
        }
        if (quantidade <= 0) {
            return "Quantidade inválida";
        }

        const animal = this.animais[especie];
        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            if (this.recintoViavel(recinto, animal, quantidade)) {
                const espacoOcupado = recinto.animaisExistentes.reduce((acc, a) => acc + this.animais[a].tamanho, 0);
                const espacoLivre = recinto.tamanhoTotal - espacoOcupado - quantidade * animal.tamanho;
                recintosViaveis.push(`Recinto nro ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return "Não há recinto viável";
        }
        return recintosViaveis;
    }

    recintoViavel(recinto, animal, quantidade) {
        // Verifica se o bioma é adequado
        if (!animal.biomas.includes(recinto.bioma)) {
            return false;
        }

        // Verifica se há espaço suficiente
        const espacoOcupado = recinto.animaisExistentes.reduce((acc, a) => acc + this.animais[a].tamanho, 0);
        let espacoNecessario = quantidade * animal.tamanho;
        if (recinto.animaisExistentes.length > 0) {
            espacoNecessario += 1; // Espaço extra para múltiplas espécies
        }

        if (espacoOcupado + espacoNecessario > recinto.tamanhoTotal) {
            return false;
        }

        // Regras específicas para carnívoros, hipopótamos e macacos
        if (["LEAO", "LEOPARDO", "CROCODILO"].includes(animal.especie)) {
            if (recinto.animaisExistentes.some(a => a !== animal.especie)) {
                return false;
            }
        }

        if (animal.especie === "HIPOPOTAMO") {
            if (recinto.bioma !== "savana e rio" && recinto.animaisExistentes.length > 0) {
                return false;
            }
        }

        if (animal.especie === "MACACO") {
            if (recinto.animaisExistentes.length === 0 && quantidade === 1) {
                return false;
            }
        }

        return true;
    }
}

const zoo = new Zoologico();

// Teste com leão
console.log(zoo.encontrarRecintosViaveis("LEAO", 1));

// Teste com macaco
console.log(zoo.encontrarRecintosViaveis("MACACO", 2));

// Teste com hipopótamo
console.log(zoo.encontrarRecintosViaveis("HIPOPOTAMO", 1));

// Teste com animal inválido
console.log(zoo.encontrarRecintosViaveis("TIGRE", 1));

// Teste com quantidade inválida
console.log(zoo.encontrarRecintosViaveis("LEAO", 0));