# RecycleMe

<style>
    .space {
        justify-content: space-between;
    }
</style>

<div>
    <a href="https://play.google.com/store/apps/details?id=com.aankur01.greendayfrontend">
        <img src="./assets/images/README/GooglePlay.png" alt="drawing" width="150"/>
    </a>
</div>

RecycleMe is a trash categorization tool used to make recycling more quick and convenient. The user can take a picture of a certain item and our ML will determine its recyclability and where to recycle it. Our map takes in a collection of data from the Google Maps API and user-generated data by both our standard users and by businesses.

<div class="space">
    <img src="./assets/images/README/MapLight.png" alt="drawing" width="150"/>
    <img src="./assets/images/README/MapDark.png" alt="drawing" width="150"/>
</div>
# SETUP

Clone this repo and then:

1. Install the necessary dependencies

    * `npm install` or `yarn install`

2. Install the expo cli

    * `npm install --global expo-cli` or `yarn install --global expo-cli`

3. Install the expo go app either on google play or the app store

4. Register or sign into an account from both your phone and your computer. 
    * `expo login` or `expo register`

5. Finally start up the environment

    * `npm run start`

You should see the app in your expo app under the **RECENTLY IN DEVELOPMENT** section



## 💻 What it does
RecycleMe allows users to locate the nearest trash cans through 3 types of data:
- the nearest recycling centers via the google maps api
- user-generated data of trash cans nearby and what materials it recycles
- local businesses which provides more specific types of data that they specifically could recycle

Happy Coding!