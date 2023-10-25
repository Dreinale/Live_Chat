# Hi Legends 👋

# <p align="center">Chat</p>

My Chat App est une application de chat qui permet aux utilisateurs de communiquer en temps réel, d'échanger des fichiers multimédias et de créer des salons de chat privés. L'application est construite en utilisant l'architecture propre, qui facilite la maintenance, la testabilité et la scalabilité du code.

# <p align="center">Exigences métier</p>

| Étape | Exigences métier|
| -------- | -------- | 
| 1 | Authentification avec un email et un mot de passe    |
| 2 | Gestion de salons de chat par des utilisateurs avec des rôles spécifiques    | 
| 3 | Communication en temps réel entre les utilisateurs dans un channel    | 
| 4 | Échange de fichiers multimédias entre les utilisateurs    | 
| 5 | Système de notifications pour les utilisateurs    | 
| 6 | Possibilité pour les utilisateurs de créer des salons de chat privés et d'inviter des utilisateurs spécifiques    | 
| 7 | Stockage des conversations passées et des messages multimédias    | 
| 8 | Possibilité pour les utilisateurs de gérer leur profil (nom d'utilisateur, photo de profil, etc.)    | 
| 9 | Système de modération pour signaler et bloquer les utilisateurs ou les messages indésirables    | 
| 10 | Notifications push sur les appareils mobiles des utilisateurs lorsqu'ils sont hors ligne    | 
        
# <p align="center">User story</p>

| Étape | User story|
| -------- | -------- | 
| 1 | En tant qu'utilisateur, je veux pouvoir m'inscrire avec mon email et mon mot de passe pour accéder à l'application de chat   |
| 2 | En tant qu'administrateur, je veux pouvoir gérer les salons de chat et assigner des rôles spécifiques à certains utilisateurs    | 
| 3 | En tant qu'utilisateur, je veux pouvoir rejoindre un salon de chat existant et discuter en temps réel avec d'autres utilisateurs    | 
| 4 | En tant qu'utilisateur, je veux pouvoir envoyer des fichiers multimédias à d'autres utilisateurs dans le salon de chat    | 
| 5 | En tant qu'utilisateur, je veux recevoir des notifications lorsque je suis mentionné ou que quelqu'un m'envoie un message    | 
| 6 | En tant qu'utilisateur, je veux pouvoir créer un salon de chat privé et inviter des utilisateurs spécifiques pour discuter en privé    | 
| 7 | En tant qu'utilisateur, je veux pouvoir voir mes conversations passées et retrouver des messages multimédias précédemment envoyés    | 
| 8 | En tant qu'utilisateur, je veux pouvoir gérer mon profil en modifiant mon nom d'utilisateur, ma photo de profil, etc.    | 
| 9 | En tant qu'administrateur, je veux pouvoir modérer les messages indésirables et bloquer les utilisateurs qui envoient des messages inappropriés    | 
| 10 | En tant qu'utilisateur, je veux recevoir des notifications push sur mon appareil mobile lorsque je ne suis pas connecté à l'application de chat    | 

## 🧑🏻‍💻 Architecture
```css
my-chat-app/
├── node_modules/
├── src/
│   ├── controllers/
│   ├── entities/
│   ├── repositories/
│   ├── use-cases/
│   └── app.js
├── tests/
│   ├── controllers/
│   ├── entities/
│   ├── repositories/
│   └── use-cases/
├── package.json
└── README.md
}
```
## Explication de l'architecture

my-chat-app/ : Contient le code source de l'application.

src/ : Contient le code source de l'application.

src/controllers/ : Contient les contrôleurs qui gèrent les interactions de l'application avec les utilisateurs.

src/entities/ : Contient les entités qui représentent les objets de domaine de l'application.

src/repositories/ : Contient les repositories qui gèrent la persistance des données dans la base de données MongoDB.

src/use-cases/ : Contient les Use Cases qui gèrent la logique métier de l'application.

src/app.js : Le point d'entrée de l'application.

tests/controllers/ : Contient les tests unitaires pour les contrôleurs.

tests/entities/ : Contient les tests unitaires pour les entités.

tests/repositories/ : Contient les tests unitaires pour les repositories.

tests/use-cases/ : Contient les tests unitaires pour les Use Cases.

package.json : Contient les dépendances de l'application.

README.md : Contient les instructions pour installer et exécuter l'application.
        
## 🙇 Author
#### Enzo Brunet & Marin Pavel
        