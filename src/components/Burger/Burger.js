import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
	let transformedIngredients = Object.keys(props.ingredients) // turn object into array
			.map(igKey => {
				return [...Array(props.ingredients[igKey])].map((_, i) => { // get number of ingredients
					return <BurgerIngredient key={igKey + i} type={igKey} />;
				})
			})
			.reduce((arr, el) => {
				return arr.concat(el);
			}, []);// [] is initial value
	if(transformedIngredients.length === 0) {
		transformedIngredients = <p>Please start adding ingredients</p>
	}
	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top" />
			{transformedIngredients}
			<BurgerIngredient type="bread-bottom" />
		</div>
	);
};
export default burger;