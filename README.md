## Find a Friend - API
#### Requisitos Funcionais(RF)

- [x] Deve ser possível cadastrar um pet;
- [x] Deve ser possível listar todos os pets disponíveis para adoção em uma cidade;
- [x] Deve ser possível filtrar pets por suas características;
- [x] Deve ser possível visualizar detalhes de um pet para adoção;
- [x] Deve ser possível se cadastrar como uma ORG;
- [x] Deve ser possível realizar login como uma ORG;
- [x] Deve ser possível cadastrar requisitos de um pet
- [x] Deve ser possível remover requisitos de um pet
- [x] Deve ser possível realizar o upload de images de um pet
- [x] Deve ser possível remover imagens de um pet

#### Regras de negocio(RN)

- [x] Para listar os pets, obrigatoriamente precisamos informar a cidade;
- [x] Uma ORG precisa ter um endereço e um número de WhatsApp;
- [x] Um pet deve estar ligado a uma ORG;
- [x] O usuário que quer adotar, entrará em contato com a ORG via WhatsApp;
- [x] Todos os filtros, além da cidade, são opcionais;
- [x] Para uma ORG acessar a aplicação como admin, ela precisa estar logada;
- [x] Uma ORG só pode alterar dados de pets associados a ela. 
- [x] Para adicionar o requisito a um pet, uma ORG precisa estar logada e o pet precisa estar associado a ela.
- [x] Para adicionar images a um pet, uma ORG precisa estar logada e o pet precisa estar associado a ela.





##### Como baixar:

```
//Clonar repositório
git clone git@github.com:mtheusbrito/find-a-friend-api.git 

// Acessar diretório
cd find-a-friend-api/ 

// Instalar dependências
npm install

// Gerar o Cliente do Prisma
npx prisma generate

// Executa os arquivos de migrações SQL no banco de dados
npm prisma migrate dev

// Iniciar projeto
npm start:dev
```
