# Coding Structure and Standards

## Folder Structure

- Main Pages of the Application go under `src/pages` directory.\
    Ex: For Home Page\
    src/pages/home\
    - home.js (JS Code)
    - home.scss (Style sheets)
    
- Components used in the pages go under `src\components` directory \
    Ex: For Chart Component\
    src/components/chart\
    - chart.js (JS Code)
    - chart.scss (Style sheets)

- Helpers/Services used in the pages go under `src\helpers` directory \
    Ex: For Data Access\
    src/helpers/data-access\
    - data-access-service.js (JS Code)

- Images go under `src/assets/img` directory

- Common Styles go unders `src/assets/scss` directory
    Ex: For Common SCSS\
    src/assets/scss
    - common.scss

- Redux Integration code like the `ACTIONS` and the `REDUCERS` go under `src/redux`
    `ACTIONS`
    - actionTypes.js (Constants For each Action)
    - < action1 >.js (Individual Actions) \
    
    `REDUCERS`
    - index.js (Import all reducers and set the reducers in this file)
    - < reducer >.js (Individual Reducers)
