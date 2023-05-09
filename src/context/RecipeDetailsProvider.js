import PropTypes from 'prop-types';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeDetailsContext from './RecipeDetailsContext';

function RecipeDetailsProvider({ children }) {
  const { pathname } = useLocation();
  const [recipeDetails, setRecipeDetails] = useState([]);
  const idRecipe = parseInt(pathname.split('/').pop(), 10);

  const fetchRecommend = useCallback(async (url) => {
    const response = await fetch(url);
    const dataRecommend = await response.json();
    return dataRecommend;
  }, []);

  const fetchDetails = useCallback(async (url) => {
    const response = await fetch(url);
    const dataDetails = await response.json();
    return setRecipeDetails(dataDetails[Object.keys(dataDetails)][0]);
  }, []);

  useEffect(() => {
    if (pathname.includes('/meals')) {
      fetchDetails(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`);
      fetchRecommend('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    } else {
      fetchDetails(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`);
      fetchRecommend('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    }
  }, [fetchDetails, idRecipe, pathname, fetchRecommend]);

  const values = useMemo(() => ({
    recipeDetails,
    pathname,
  }), [recipeDetails, pathname]);

  return (
    <RecipeDetailsContext.Provider value={ values }>
      { children }
    </RecipeDetailsContext.Provider>
  );
}

RecipeDetailsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RecipeDetailsProvider;
