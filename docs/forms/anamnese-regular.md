# Dentalhub - Prontuários

### Anamnese Regular:

Documento de descrição para as questões abordadas nos formulários. Para esse formulário, primeiro é necessario realizar o cadastro dos **Dados Pessoais**, após isso, assinar os termos de confidencialidade.

**Tópico 01:** Queixa Principal e História da Doença Atual. (Pág. 1)

```
{
	index: "qp-01",
	label: "Queixa Principal",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	highlight: false,
	type: "text",

	//
	value: "Descrição longa sobre a queixa principal.",
},
{
	index: "hda-01",
	label: "História da Doença Atual",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	highlight: false,
	type: "text",

	//
	value: "Descrição longa sobre a doença atual.",
}
```

**Tópico 02:** História Médica Pregressa e Atual. (Pág. 1 - Pág. 2)

```
{
	index: "htmpa-01",
	label: "Você já teve ou já tem: Doenças da Infância",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: false,
	items: [
		"Catapora",
		"Caxumba",
		"Sarampo",
		"Amigdalite",
	],

	//
	value: "0-2-3-Sarampo",
},
{
	index: "htmpa-02",
	label: "Você já teve ou já tem: Distúrbios Cardiovasculares",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: true,
	items: [
		"Febre reumática",
		"Sopros",
		"Patologias de válvulas",
		"Anomalias congênitas cardíacas",
		"Hipertensão",
		"Arritmias",
		"Infarto do miocárdio",
		"Angina ou dor no tórax",
		"Cirurgias Cardíacas",
		"Marca-passo",
		"AVC (Derrame)",
	],

	//
	value: "2-3-4-6",
},
{
	index: "htmpa-03",
	label: "Você já teve ou já tem: Doenças Respiratórias",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: false,
	items: [
		"Asma",
		"Doenças pulmonares",
		"Sinusite",
		"Rinite",
	],

	//
	value: "1-3-2",
},
{
	index: "htmpa-04",
	label: "Você já teve ou já tem: Doenças Gastrointestinais",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: false,
	items: [
		"Gastrite",
		"Úlceras",
		"Cirrose",
	],

	//
	value: "1-3-2",
}
{
	index: "htmpa-05",
	label: "Você já teve ou já tem: Doenças Genitourinárias",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: false,
	items: [
		"Infecções do trato urinário",
		"Doenças ginecológicas",
		"Doenças renais",
		"Nefrite",
		"Insuficiência renal",
		{
			index: "htmpa-05-01",
			label: "Faz hemodiálise? Se sim, quais?",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "text",
		},
	],

	//
	value: "1-3-2-(htmpa-05-01)",
},
{
	index: "htmpa-06",
	label: "Você já teve ou já tem: Disturbios Endócrinos",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: true,
	items: [
		"Diabete",
		"Disfunção de tireóide",
		{
			index: "htmpa-06-01",
			label: "Menarca (anos)",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "text",
		},
		{
			index: "htmpa-06-02",
			label: "Menopausa (anos)",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "text",
		},
		{
			index: "htmpa-06-03",
			label: "Partos (nº)",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "text",
		},
	],

	//
	value: "(htmpa-06-01)-(htmpa-06-02)-(htmpa-06-03)",
},
{
	index: "htmpa-07",
	label: "Você já teve ou já tem: Disturbios Neurológicos",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: false,
	items: [
		"Desmaios",
		"Convulsões",
		"Enxaquecas",
		"Cafaléias",
		"Nevralgia na face",
	],

	//
	value: "1-3-2",
},
{
	index: "htmpa-08",
	label: "Você já teve ou já tem: Disturbios Hematológicos",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: true,
	items: [
		"Anemia",
		"Hemorragia",
		"Hemofilia",
		"Leucemia",
		{
			index: "htmpa-08-01",
			label: "Doou ou recebeu sangue? Se sim, quando?",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "text",
		},
	],

	//
	value: "(htmpa-08)",
},
{
	index: "htmpa-09",
	label: "Você já teve ou já tem: Disturbios Psiquiátricos",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: false,
	items: [
		"Tratamento psiquiátrico",
		"Depressão",
		"Ansiedade",
	],

	//
	value: "1-3-2",
},
{
	index: "htmpa-10",
	label: "Você já teve ou já tem: Disturbios das Articulações/Ossos",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: false,
	items: [
		"Traumatismos na face",
		"Artrite",
		"Reumatismo",
		"Osteoporose",
	],

	//
	value: "1-3-2",
},
{
	index: "htmpa-11",
	label: "Você já teve ou já tem: Disturbios das Articulação Têmporomandibular",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: false,
	items: [
		"Bruxismo Cêntrico",
		"Bruxismo Excêntrico",
		"Mastigação unilateral",
		"Dor na região dos ouvidos",
		"Estalido na abertura e fechamento bucal",
	],

	//
	value: "1-3-2",
},
{
	index: "htmpa-12",
	label: "Você já teve ou já tem: Doenças Transmissiveis",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: true,
	items: [
		"Hepatite",
		"Herpes",
		"HIV",
		"Tuberculose",
		{
			index: "htmpa-12-01",
			label: "Doenças Sexualmente Transmissível",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "text",
		},
	],

	//
	value: "1-3-2",
},
{
	index: "htmpa-13",
	label: "Você já teve ou já tem: Alergias",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: true,
	items: [
		"Anestesia",
		"Alimentos",
		"Cosméticos",
		"Urticária",
		{
			index: "htmpa-12-01",
			label: "Utiliza medicamentos para as alergias?",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "text",
		},
	],

	//
	value: "1-3-2",
},
{
	index: "htmpa-14",
	label: "Faz uso de medicamentos? Nome comercial, nome genérico, dosagem e frequência de uso",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: true,

	//
	value: "Lista de medicamentos que o paciente utiliza.",
},
{
	index: "htmpa-15",
	label: "Visitas médicas",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-16",
	label: "Hospitalizações",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-17",
	label: "Observações",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-18",
	label: "Predisposição Hereditária: Pai",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-19",
	label: "Predisposição Hereditária: Mãe",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-20",
	label: "Predisposição Hereditária: Irmãos",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-21",
	label: "Predisposição Hereditária: Doenças",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	others: true,
	highlight: true,
	items: [
		"Cardiopatias",
		"Hipertensão",
		"Diabete",
		"Asma",
		"Distúrbios do sangramento",
		"Alergias",
		"Neoplastia Malígnas",
		"Doenças neurológicas",
		"Tuberculose",
		{
			index: "htmpa-21-01",
			label: "Complemento",
			description: "Descrição da pergunta e o motivo de perguntá-la",
			type: "text",
		},
	],

	//
	value: "1-3-2",
},
{
	index: "htmpa-22",
	label: "Hábitos: Álcool (Início e Frequência)",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-23",
	label: "Hábitos: Fumo (Início e Frequência)",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-24",
	label: "Hábitos: Outros hábitos nocivos",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-25",
	label: "Hábitos: Escovação",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-26",
	label: "Hábitos: Fio Dental",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "htmpa-27",
	label: "Hábitos: Enxaquatório bucal",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
```

**Tópico 03:** Exame Físico (Pág 3.)

```
{
	index: "ef-01",
	label: "Sinais vitais: Pressão Arterial",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "'120/80'",
},
{
	index: "ef-02",
	label: "Sinais vitais:: Frequequencia respiratória",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,
	

	//
	value: "16",
},
{
	index: "ef-03",
	label: "Sinais vitais:: Pulso",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,
	

	//
	value: "80",
},
{
	index: "ef-04",
	label: "Sinais vitais:: Temperatura axilar",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "36.7",
},
{
	index: "ef-05",
	label: "Ectoscopia(Exame extrabucal)(fácies, cadeias linfáticas, ATM,músculos mastigatórios)",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "ef-06",
	label: "Oroscopia(Exame intrabucal)(lábio,mucosa jugal,fundo de saco vestíbulo,língua,assoalho de boca,trígono retromolar,palato,orofaringe,periodonto,dentes)",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "ef-07",
	label: "Exames complementares solicitados",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "ef-08",
	label: "Pedido de avaliação médica",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"Sim",
		"Não",
	]

	//
	value: "1",
},
{
	index: "ef-09",
	label: "Pedido de avaliação médica: motivo",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
<!-- 	to usando o campo de data como text mas acho que da pra mudar pra type DATE  -->
	index: "ef-10",
	label: "Pedido de avaliação médica: data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "01/06/2024",
},
{
	index: "ef-11",
	label: "Pedido de avaliação médica: Parecer médico",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "ef-12",
	label: "Pedido de avaliação médica: Paciente portador de ",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "ef-13",
	label: "Pedido de avaliação médica: necessita de cuidados especiais em relção a ",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "ef-14",
	label: "Observações ",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
```
**Tópico 04:** Secção de Identificação Legal e Diagnóstico (Pág 4 - Pág. 5)
```
{
	<!-- nao tenho certeza que esse é feito assim  -->
	index: "sild-01",
	label: "Dentes(assinalar com um circulo quando o dente for decíduo) ",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,
	items: [
		"18",
		"17",
		"16",
		"15/55",
		"14/54",
		"13/53",
		"12/52",
		"11/51",
		"21/61",
		"22/62",
		"23/63",
		"24/64",
		"25/65",
		"26",
		"27",
		"28",
		"38",
		"37",
		"36",
		"35/75",
		"34/74",
		"33/73",
		"32/72",
		"31/71",
		"41/81",
		"42/82",
		"43/83",
		"44/84",
		"45/85",
		"46",
		"47",
		"48",
	],

	//
	value: "Campo aberto para resposta",
},
{
	index: "sild-02",
	label: "Periodontite leve",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "sild-03",
	label: "Periodontite grave",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "sild-04",
	label: "e Complicada",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "sild-05",
	label: "Observações ",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	<!-- to usando o campo de data como text mas acho que da pra mudar pra type DATE -->
	index: "sild-06",
	label: "Data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "20/05/2024",
},
```
**Tópico 04:** Plano Cronológico de Tratamento (Pág 6 - Pág. 7)
```
{
	index: "pct-01",
	label: "Plano Cronológico de Tratamento",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	<!-- to usando o campo de data como text mas acho que da pra mudar pra type DATE -->
	index: "pct-02",
	label: "Data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "20/05/2024",
},

```
**Tópico 05:** Controle de Placa Bacteriana (Pág 8 - Pág. 9)
```
{
	<!-- to usando o campo de data como text mas acho que da pra mudar pra type DATE -->
	index: "cpb-01",
	label: "Data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "20/05/2024",
},
{
	<!-- nao tenho certeza que esse é feito assim -->
	index: "cpb-02",
	label: "Controle de Placa Bacteriana",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"18",
		"17",
		"16",
		"15",
		"14",
		"13",
		"12",
		"11",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"31",
		"32",
		"33",
		"34",
		"35",
		"36",
		"37",
		"38",
		"48",
		"47",
		"46",
		"45",
		"44",
		"43",
		"42",
		"41",
	],
	//
	value: "18-28-31",
},
{
	<!-- to usando o campo de data como text mas acho que da pra mudar pra type DATE -->
	index: "cpb-03",
	label: "Data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "20/05/2024",
},
{
	<!-- nao tenho certeza que esse é feito assim -->>
	index: "cpb-04",
	label: "Controle de Placa Bacteriana",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"18",
		"17",
		"16",
		"15",
		"14",
		"13",
		"12",
		"11",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"31",
		"32",
		"33",
		"34",
		"35",
		"36",
		"37",
		"38",
		"48",
		"47",
		"46",
		"45",
		"44",
		"43",
		"42",
		"41",
	],
	//
	value: "18-28-31",
},
{
	<!-- to usando o campo de data como text mas acho que da pra mudar pra type DATE -->
	index: "cpb-05",
	label: "Data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "20/05/2024",
},
{
	<!-- nao tenho certeza que esse é feito assim -->
	index: "cpb-06",
	label: "Controle de Placa Bacteriana",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"18",
		"17",
		"16",
		"15",
		"14",
		"13",
		"12",
		"11",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"31",
		"32",
		"33",
		"34",
		"35",
		"36",
		"37",
		"38",
		"48",
		"47",
		"46",
		"45",
		"44",
		"43",
		"42",
		"41",
	],
	//
	value: "18-28-31",
},
{
	<!-- to usando o campo de data como text mas acho que da pra mudar pra type DATE -->
	index: "cpb-07",
	label: "Data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "20/05/2024",
},
{
	<!-- nao tenho certeza que esse é feito assim -->
	index: "cpb-08",
	label: "Controle de Placa Bacteriana",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"18",
		"17",
		"16",
		"15",
		"14",
		"13",
		"12",
		"11",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"31",
		"32",
		"33",
		"34",
		"35",
		"36",
		"37",
		"38",
		"48",
		"47",
		"46",
		"45",
		"44",
		"43",
		"42",
		"41",
	],
	//
	value: "18-28-31",
},

```
**Tópico 06:** Endodontia (Pág 10 )
```
{
	index: "e-01",
	label: "Dente",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "e-02",
	label: "Número de canais",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "e-03",
	label: "Exame Clínico: Diagnóstico pulpar",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"Normal",
		"Pulpite reversível",
		"Pulpite irreversivel",
		"Necrose",
		"Dente já tratado",
	],

	//
	value: "0",
},
{
	index: "e-04",
	label: "Exame Clínico: Teste de percussão",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"Insensível",
		"Sensível",
		"Muito sensível",
	],

	//
	value: "0",
},
{
	index: "e-05",
	label: "Exame Clínico: Presença de abscesso",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"Não",
		"Sim",
		"Intra-bucal",
		"Extra-bucal",
		"Com fistula",
		"Sem fistula",
	],

	//
	value: "1-2-4",
},
{
	index: "e-06",
	label: "Exame Clínico: Exame radiográfico Região periapical",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"Normal",
		"Com lesão",
		"Difusa",
		"Circunscrita",
	],

	//
	value: "1",
},
{
	index: "e-07",
	label: "Exame Clínico: Exsudato nos canais",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"Ausente",
		"Claro",
		"Hemorrágio",
		"Purulento",
	],

	//
	value: "1",
},
{
	index: "e-08",
	label: "Exame Clínico: Dor entre as sessões",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	items: [
		"Sim",
		"Não",
	],

	//
	value: "1",
},
{
	index: "e-09",
	label: "Exame Clínico: Solução irrigadora",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,
	others: true,

	//
	value: "5",
},
{
	index: "e-10",
	label: "Exame Clínico: Cimento obturador",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,
	others: true,

	//
	value: "Campo aberto para resposta",
},
{
	index: "e-11",
	label: "Exame Clínico: Técnica de obturação",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "multioption",
	highlight: false,
	others: true,

	//
	value: "0",
},
{
	index: "e-12",
	label: "Exame Clínico: Material restaurador provisório",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
```
**Tópico 07:** Odontometria (Pág 10 - Pág 11 )
```
{
	index: "0-01",
	label: "Canal",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-02",
	label: "CAD",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-03",
	label: "CRD",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-04",
	label: "CRT",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-05",
	label: "Diâmetro Anatômico ",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-06",
	label: "Diâmetro Cirúrgico",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-07",
	label: "Ponto de Referência",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-08",
	label: "Curativos: 1ª sessão",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-09",
	label: "Curativos: 2ª sessão",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-10",
	label: "Curativos: 3ª sessão",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-11",
	label: "Curativos: 4ª sessão",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-12",
	label: "Curativos: 5ª sessão",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-13",
	label: "Curativos: 6ª sessão",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-14",
	label: "Observações",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "0-15",
	label: "Restauração definitiva do dente",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	<!-- 	to usando o campo de data como text mas acho que da pra mudar pra type DATE  -->
	index: "0-16",
	label: "Inicio do tratamento",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "12/02/2024",
},
{
	<!-- 	to usando o campo de data como text mas acho que da pra mudar pra type DATE  -->
	index: "0-17",
	label: "Término do tratamento",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "12/04/2024",
},
{
	index: "0-17",
	label: "Número de sessões realizadas",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	<!-- 	to usando o campo de data como text mas acho que da pra mudar pra type DATE  -->
	index: "0-18",
	label: "Retorno",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	<!-- 	to usando o campo de data como text mas acho que da pra mudar pra type DATE  -->
	index: "0-19",
	label: "Retorno: 6 meses",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	<!-- 	to usando o campo de data como text mas acho que da pra mudar pra type DATE  -->
	index: "0-20",
	label: "Retorno: 1 ano",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},

```
**Tópico 08:** Autorização para Execuao de Tratamento (Pág 11 - Pág 12 )
```
{
	index: "apet-01",
	label: "Nome completo",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "apet-02",
	label: "Documento",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	<!-- 	to usando o campo de data como text mas acho que da pra mudar pra type DATE  -->
	index: "apet-03",
	label: "Data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "apet-04",
	label: "Assinatura do Paciente ou responsável legal",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	<!-- 	to usando o campo de data como text mas acho que da pra mudar pra type DATE  -->
	index: "apet-05",
	label: "Data",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},
{
	index: "apet-06",
	label: "Assinatura do Paciente ou responsável legal",
	description: "Descrição da pergunta e o motivo de perguntá-la",
	type: "text",
	highlight: false,

	//
	value: "Campo aberto para resposta",
},

```
**Tópico 09:** Ficha de Diagnóstico Periodontal ( Pág 12 )
```
```