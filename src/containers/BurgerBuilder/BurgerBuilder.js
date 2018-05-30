import React, {Component} from 'react';

import Aux from './../../hoc/Auxiliary/Auxiliary';
import BuildControls from './../../components/Burger/BuildControls/BuildControls';
import Burger from './../../components/Burger/Burger';
import Modal from './../..//components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	/*constructor(props) {
		super(props);
		this.state = {};
	}*/
	state = {
		ingredients: {
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 0
		},
		totalPrice: 4,
		purchasable: false,
		purchasing: false
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => sum + el, 0);
		this.setState({purchasable: sum > 0});
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];//store previous number of ingredients
		const updatedCounted = oldCount + 1; // increment this value
		const updateIngredients = {...this.state.ingredients};
		updateIngredients[type] = updatedCounted;

		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({totalPrice: newPrice, ingredients: updateIngredients });
		this.updatePurchaseState(updateIngredients);
	}

	removeIngredientHandler = type => {
		const oldCount = this.state.ingredients[type];
		if(oldCount <= 0) {
			return;
		}
		const updatedCounted = oldCount - 1;
		const updateIngredients = {...this.state.ingredients};
		updateIngredients[type] = updatedCounted;

		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceDeduction;
		this.setState({totalPrice: newPrice, ingredients: updateIngredients });
		this.updatePurchaseState(updateIngredients);
	}

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}

	purchaseContinueHandler = () => {
		alert('You continue');
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients //create a cope of ingredients obj
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		} // we've got object like: {salad: true, meat:false, ...}
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					<OrderSummary 
						ingredients={this.state.ingredients}
						price={this.state.totalPrice.toFixed(2)}
						purchaseCanceled={this.purchaseCancelHandler}
						purchaseContinued={this.purchaseContinueHandler} />
				</Modal>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					purchasable={!this.state.purchasable}
					ordered={this.purchaseHandler}
					price={this.state.totalPrice} />
			</Aux>
		);
	}
}

export default BurgerBuilder;