# Dentalhub - Prontuários

### ATM:

Documento de descrição para as questões abordadas nos formulários. Para esse formulário, primeiro é necessario realizar o cadastro dos **Dados Pessoais**, após isso, assinar os termos de confidencialidade.

**Tópico 01:** Triagem da Dor por DTM. (Pág. 1)

```
{
	index: "tdd-01",
	label: "Nos últimos 30 dias, quanto tmepo durou qualquer dor que voce teve na mandibula ou na região temporal em qualquer um dos lados?",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"a. Não tive dor",
		"b. Dor aparecia e desaparecia",
		"c. Dor estava sempre presente",
	],

	//
	value: "0",
},
{
	index: "tdd-02",
	label: "Nos últimos 30 dias, voce teve dor ou rigidez na sua mandibula ao acordar?",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"a. Não ",
		"b. Sim",
	],

	//
	value: "0",
},
{
	index: "tdd-03",
	label: "Nos últimos 30 dias, as seguintes atividades mudaram qualquer dor(isto é, fizeram ela melhorar ou piorar) na sua mandibula ou região temporal em qualquer um dos lados",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		{
			index: "tdd-03-01",
			label: "A. Mastigar alimentos duros ou consistentes",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
		{
			index: "tdd-03-02",
			label: "B. Abrir a boca ou movimentar a mandibula para frente ou para o lado",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
		{
			index: "tdd-03-03",
			label: "C. Hábitos ou manias com a mandibula(boca), como manter os dentes juntos, apertar ou ranger od dentes, ou mastigar chiclete",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
		{
			index: "tdd-03-04",
			label: "D. Outras atividades com mandibula(boca) como falar, beijar, bocejar",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
	],

	//
	value: "(tdd-03-01)-(tdd-03-02)-(tdd-03-03)-(tdd-03-04)",
},
```
**Tópico 02:** Questionário de Sintomas do DC/TMD. (Pág. 2 - Pág. 3 )
```
{
	index: "qsDT-01",
	label: "Nome do Paiciente",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	highlight: false,
	type: "text",

	//
	value: "Nome do paciente",
},
{
	index: "qsDT-02",
	label: "Data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	highlight: false,
	type: "text",

	//
	value: "01/01/2024",
},
{
	index: "qsDT-03",
	label: "DOR: 1. Voce já sentiu dor na mandibula(boca), tempora, no ouvido ou na frente do ouvido em qualquer um dos lados? e Respondeu NÃO, pule pra a Questão 5.",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"a. Não ",
		"b. Sim",
	],

	//
	value: "0",
},
{
	index: "qsDT-04",
	label: "DOR: 2. Há quantos anos ou meses atrás voce sentiu pela primeira vez dor na mandibula(boca), tempora, no ouvido ou na frente do ouvido?",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,
	items: [
		"anos",
		"meses",
	],

	//
	value: "2-12",
},
{
	index: "qsDT-05",
	label: "DOR: 3. Nos últimos 30 dias, qual das seguintes respostas decreve melhor qualquer dor que voce teve na mandibula, tempora no ouvido ou na frente do ouvido em qualquer um dos lados? Se Respondeu Nenhuma Dor, pule pra a Questão 5.",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"Nenhuma dor",
		"A dor vem e vai",
		"A dor está sempre presente",
	],

	//
	value: "0",
},
{
	index: "qsDT-06",
	label: "DOR: 4. Nos últimos 30 dias, alguma dass eguintes atividades mudou qualquer dor ( isto é, melhorou ou piorou a dor) na sua mandibula tempora, na ouvido ou na frente do ouvido em qualquer um dos lados?",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		{
			index: "qsDT-06-01",
			label: "A. Mastigar alimentos duros ou resistentes",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
		{
			index: "qsDT-06-02",
			label: "B. Abrir a boca ou movimentar a mandibula para frente ou para o lado",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
		{
			index: "qsDT-06-03",
			label: "C. Hábitos ou maniass com a mandibula(boca), como manter os dentes juntos, apertar ou ranger os dentes ou mastigar chiclete",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
		{
			index: "qsDT-06-04",
			label: "D. Outras atividadess com a mandibula (boca) como falar, beijar, bocejar ",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
	],

	//
	value: "(qsDT-06-01)-(qsDT-06-02)-(qsDT-06-03)-(qsDT-06-04)",
},
{
	index: "qsDT-07",
	label: "DOR DE CABEÇA: 5. Nos últimos 30 dias, voce teve alguma dor de cabeça que incluiu as áreas das temporas da sua cabeça? e Respondeu NÃO, pule pra a Questão 8.",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"a. Não ",
		"b. Sim",
	],

	//
	value: "0",
},
{
	index: "qsDT-08",
	label: "DOR DE CABEÇA: 6. Há quantos anos ou meses atrás a sua dor da cabeça na tempora começou pelo primeiro vez?",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,
	items: [
		"anos",
		"meses",
	],

	//
	value: "2-12",
},
{
	index: "qsDT-09",
	label: "DOR DE CABEÇA: 7. Nos últimos 30 dias, as seguintes atividades mudaram sua dor de cabeça ( isto é, melhorou ou piorou a dor) na sua regiào tempora em algum dos lados?",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		{
			index: "qsDT-09-01",
			label: "A. Mastigar alimentos duros ou resistentes",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
		{
			index: "qsDT-09-02",
			label: "B. Abrir a boca ou movimentar a mandibula para frente ou para o lado",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
		{
			index: "qsDT-09-03",
			label: "C. Hábitos ou maniass com a mandibula(boca), como manter os dentes juntos, apertar ou ranger os dentes ou mastigar chiclete",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
		{
			index: "qsDT-09-04",
			label: "D. Outras atividadess com a mandibula (boca) como falar, beijar, bocejar ",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "multioption",
			items: [
				"a. Não",
				"b. Sim",
			]
		},
	],

	//
	value: "(qsDT-09-01)-(qsDT-09-02)-(qsDT-09-03)-(qsDT-09-04)",
},
{
	index: "qsDT-10",
	label: "RUÍDOS ARTICULARES: 8. Nos últimos 30 dias, voce ouviu algum som ou barulho na articulção quando movimentou ou usou a sua mandibula(boca)?",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		" Não ",
		" Sim",
		" D ",
		" E ",
		" Não Sabe ",
	],

	//
	value: "0-2",
},
{
	index: "qsDT-11",
	label: "Travamento FECHADO NA MANDIBULA: 9. Algumes vez sua mandibula(boca) travou ou hesitou, mesmo que por um momento, de forma que voce não conseguiu abri ATÉ O FIM? Se voce respondeu NÃO para a Questão 9, pule para Questão 13.",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		" Não ",
		" Sim",
		" D ",
		" E ",
		" Não Sabe ",
	],

	//
	value: "0-2",
},
{
	index: "qsDT-12",
	label: "RUÍDOS ARTICULARES: 10. Sua mandibula (boca) travou ou hesitou o suficiente a ponto de irritar a sua abertura e interferir com a sua capacidade de comer",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		" Não ",
		" Sim",
		" D ",
		" E ",
		" Não Sabe ",
	],

	//
	value: "0-2",
},
{
	index: "qsDT-13",
	label: "Travamento FECHADO NA MANDIBULA: 11. Nos últimos 30 dias sua mandibula (boca) travou de tal forma que voce não conseguiu abrir ATÉ O FIM, mesmo que por um momento apenas, e depoisdestravou e voce conseguiu abrir ATÉ O FIM? Se voce respondeu NÃO para a Questão 11, pule para Questão 13.",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		" Não ",
		" Sim",
		" D ",
		" E ",
		" Não Sabe ",
	],

	//
	value: "0-2",
},
{
	index: "qsDT-14",
	label: "Travamento FECHADO NA MANDIBULA: 12. Nesse momento sua mandibula (boca) está travada ou com pouca abertura de forma que voce não conssegue abrir ATÉ O FIM?",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		" Não ",
		" Sim",
		" D ",
		" E ",
		" Não Sabe ",
	],

	//
	value: "0-2",
},
{
	index: "qsDT-15",
	label: "TRAVAMENTO ABERTO DA MANDIBULA: 13. Nos últimos 30 dias, quando voce abriu basstante a boca, ela travou ou hesitou mesmo que por um momento, de forma que voce não conseguiu fecha-la e partir dessa posição de ampla abertura? Se voce respondeu NÃO para a Questão 13, então voce terminou.",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		" Não ",
		" Sim",
		" D ",
		" E ",
		" Não Sabe ",
	],

	//
	value: "0-2",
},
{
	index: "qsDT-16",
	label: "TRAVAMENTO ABERTO DA MANDIBULA: 14. Nos últimos 30 dias, quando sua mandibula (boca) travou ou hesitou nesta posição de ampla abertura, voce precisou fazer alguma coisa para fecha-la como relaxar, movimentar, empurrar ou fazer algum movimento (manobra) com a boca?",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		" Não ",
		" Sim",
		" D ",
		" E ",
		" Não Sabe ",
	],

	//
	value: "0-2",
},
```