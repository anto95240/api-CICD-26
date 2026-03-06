2/ écrire maintenant la fonction : calculateCartTotal en fonction des test unitaire réaliser en TDD V
3/ créer une branche staging V
4/ créer une github action pour lancer les tests : build, lint, prettier, test unitaire sur PR develop => staging V
5/ docker build => construire l'image V
run => executer V
6/ versionner votre image avec un registory : Docker Hub / Github container registery V
7/ changer votre ci/cd :
-PR dev => staging (test, build image docker, push registory, webhook de deploiement)
8/ Test de performance K6 : - Créer un script test de charge sur une route testable 10s - test intermédiaire en local - améliorer votre API, ORM / une database / un seeds de donnée - a deployer - automatiser le lancement de ce script dans la CI - relancer les tests de charges, avoir un contast - trouvé un moyen de baisser les temps de réponses sur la route que vous tester
