# KinoKast
Filmide ja seriaalide avastamise rakendus, mis kasutab TMDb API-t.


## Projekti kirjeldus
KinoKast on mitmeleheküljeline filmide ja seriaalide rakendus, mis võimaldab kasutajal:

- Sirvida populaarseid, kõrgelt hinnatud ja kinos mängivaid filme
- Leida populaarseid ja kõrgeima reitinguga sarjasid
- Otsida filme ja sarjasid globaalse otsinguga
- Filtreerida ja sorteerida tulemusi
- Vaadata detailset infot iga filmi/sarja kohta
- Salvestada lemmikuid (localStorage)


## Kasutatud API
### TMDb (The Movie Database)
Dokumentatsioon: https://developer.themoviedb.org/docs


# Käivitamine
### Eeldused
- Node.js >= 18
- TMDb API võti (tasuta: https://www.themoviedb.org/settings/api)


### Käivitamise sammud:
```bash
# 1. Klooni repositoorium
git clone https://github.com/AnvarKubja/API-Call.git
cd API-Call\KinoKast

# 2. Paigalda vajalikud paketid
npm install

# 3. Käivita server
npm run dev

# Rakendus töötab aadressil http://localhost:5173
```
