# Test technique Mediahub

Votre Product Owner vous confie l'US suivante:

> En tant que chargé de matériel travaillant sur Mediahub, je veux pouvoir consulter le patrimoine de films du groupe et trouver rapidement un film.
> - Je veux pouvoir rechercher un film spécifique par son titre ou une portion de son titre.
> - Je veux pouvoir trier les résultats par titre, ou par la note Rotten Tomatoes, la note IMDB, ou le nombre de votes sur IMDB.
> - Je veux pouvoir consulter tous les détails d'un film spécifique
> - Je veux pouvoir reprendre rapidement ma recherche après avoir consulté les détails d'un film

Vous devez fournir aux utilisateurs une interface web répondant aux besoins exprimés par le PO.
Pour cela, vous avez accès à une API de recherche de films. Le test consiste à fournir une interface de recherche très simple qui exploite les données de cette API.

Vous devrez prendre en compte les contraintes suivantes:

- L'API nécéssite une authentification. Vous devrez permettre aux utilisateurs de se connecter, puis authentifier les requêtes HTTP grâce au token d'authentification fourni par l'API.
- L'API limite le nombre de requêtes à une seule requête par seconde. Si vous dépassez cette limite, la requête sera rejetée par l'API avec un status
`429 Too many requests`

Nous ne donnons pas d'instructions spécifiques sur l'esthétique de l'application, mais nous accorderons une importance particulière à
l'ergonomie.

## Lancer l'API

Vous aurez besoin de node.js sur votre poste, dans une version 14 ou supérieure.

```shell
# Ouvrir le répertoire
cd api/

# Installer les dépendances
yarn

# Lancer le serveur
yarn start
```

```shell
yarn run v1.22.18
$ nest start
[Nest] 88118  - 20/09/2022 14:30:12     LOG [NestFactory] Starting Nest application...
```

## Contrat d'interface de l'API

### Authentification

#### Obtenir un token

Requête

```
POST http://localhost:3000/auth/login
```

```json
{
	"username": "Canal-plus",
	"password": "Super-secret"
}
```

Réponse

```json
{
	"token": "57620787-c290-4e09-8bc9-2c8a6f3d3e27"
}
```

#### Utiliser le token

Ajouter le token dans le header `Authorization` de la requête, au format `Bearer <token>`

### Recherche de films

#### Requête

```
GET http://localhost:3000/movies
```

Paramètres de l'URL:

- `query`: Une portion de titre à chercher
- `sortBy`: Un champ à utiliser pour le tri (`Title`, `Director` ...)

Les deux champs sont optionnels.

#### Réponse

```typescript
interface Movie {
	id: number;
  'Title': string;
  'US Gross'?: number;
  'US DVD Sales'?: number;
  'Worldwide Gross'?: number;
  'Production Budget'?: number;
  'Release Date'?: string;
  'Distributor'?: string;
  'IMDB Rating'?: number;
  'IMDB Votes'?: number;
  'Major Genre'?: string;
  'Director'?: string;
  'Rotten Tomatoes Rating'?: string;
}
```

#### Exemple complet

```shell
curl --request GET \
  --url 'http://localhost:3000/movies?query=Toy&sortBy=IMDB%20Votes' \
  --header 'Authorization: Bearer 57620787-c290-4e09-8bc9-2c8a6f3d3e27`
```

```json
[
	{
		"Title": "Toy Story 3",
		"US Gross": 410640665,
		"Worldwide Gross": 1046340665,
		"US DVD Sales": null,
		"Production Budget": 200000000,
		"Release Date": "Jun 18 2010",
		"MPAA Rating": "G",
		"Running Time min": 102,
		"Distributor": "Walt Disney Pictures",
		"Source": "Original Screenplay",
		"Major Genre": "Adventure",
		"Creative Type": "Kids Fiction",
		"Director": null,
		"Rotten Tomatoes Rating": 99,
		"IMDB Rating": 8.9,
		"IMDB Votes": 67380,
		"id": 2987
	},
	{
		"Title": "Toy Story 2",
		"US Gross": 245852179,
		"Worldwide Gross": 484966906,
		"US DVD Sales": null,
		"Production Budget": 90000000,
		"Release Date": "Nov 19 1999",
		"MPAA Rating": "G",
		"Running Time min": 92,
		"Distributor": "Walt Disney Pictures",
		"Source": "Original Screenplay",
		"Major Genre": "Adventure",
		"Creative Type": "Kids Fiction",
		"Director": "John Lasseter",
		"Rotten Tomatoes Rating": 100,
		"IMDB Rating": 8,
		"IMDB Votes": 119357,
		"id": 2986
	},
	{
		"Title": "Toy Story",
		"US Gross": 191796233,
		"Worldwide Gross": 361948825,
		"US DVD Sales": null,
		"Production Budget": 30000000,
		"Release Date": "Nov 22 1995",
		"MPAA Rating": "G",
		"Running Time min": null,
		"Distributor": "Walt Disney Pictures",
		"Source": "Original Screenplay",
		"Major Genre": "Adventure",
		"Creative Type": "Kids Fiction",
		"Director": "John Lasseter",
		"Rotten Tomatoes Rating": 100,
		"IMDB Rating": 8.2,
		"IMDB Votes": 151143,
		"id": 992
	}
]
```

### Consultation d'un film spécifique

#### Requête

```
GET http://localhost:3000/movies/:id
```

```shell
curl --request GET \
  --url http://localhost:3000/movies/1058 \
  --header 'Authorization: Bearer 1b3d009c-33dc-4209-9f2c-d65155511261'
```

#### Réponse

```json
{
	"Title": "102 Dalmatians",
	"US Gross": 66941559,
	"Worldwide Gross": 66941559,
	"US DVD Sales": null,
	"Production Budget": 85000000,
	"Release Date": "Nov 22 2000",
	"MPAA Rating": "G",
	"Running Time min": 100,
	"Distributor": "Walt Disney Pictures",
	"Source": "Based on Book/Short Story",
	"Major Genre": "Comedy",
	"Creative Type": "Kids Fiction",
	"Director": "Kevin Lima",
	"Rotten Tomatoes Rating": 30,
	"IMDB Rating": 4.4,
	"IMDB Votes": 7147,
	"id": 1058
}
```

## Lancer l'application frontend

```shell
# Ouvrir le répertoire
cd mediahub

# Installer les dépendances
npm install

# Lancer l'application
npm start
```
