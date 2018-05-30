import React, {Component} from 'react';

import Aux from './../../hoc/Auxiliary/Auxiliary';
import BuildControls from './../../components/Burger/BuildControls/BuildControls';
import Burger from './../../components/Burger/Burger';
import Modal from './../..//components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';
import Spinner from './../../components/UI/Spinner/Spinner';
import withErrorHandler from './../../hoc/withErrorHandler/withErrorHandler';

import axios from './../../axios-orders';

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
		ingredients: null,
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount () {
		axios.get('https://react-my-burger-4daf6.firebaseio.com/ingredients.json')
			.then(response => {
				let ingredients = response.data;
				let totalPrice = Object.keys(ingredients)
					.map(igKey => ingredients[igKey] > 0 ? (ingredients[igKey] * INGREDIENT_PRICES[igKey]) : 0)
					.reduce((acc, el) => acc + el, 0);

				this.setState((prevState, nextState) => {
					return {
						ingredients,
						totalPrice: totalPrice + prevState.totalPrice
					}
				});
			})
			.catch(e => {
				this.setState({error: true})
			})
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
		//alert('You continue');
		this.setState({loading: true});
		const order = {
			ingredients: this.state.ingredients,
			price: this.state.totalPrice,
			customer: {
				name: 'Askhat Assiljbekov',
				address: {
					street: 'Tststreet',
					zipCode: '14131',
					country: 'Russia'
				},
				email: 'test@gmail.com'
			},
			defiveryMethod: 'fastest'
		}
		axios.post('/orders.json', order)
			.then(response => {
				this.setState({loading: false, purchasing: false});
			})
			.catch(err => {
				this.setState({loading: false, purchasing: false});
			});
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients //create a cope of ingredients obj
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		} // we've got object like: {salad: true, meat:false, ...}

		let orderSummary = null; 

		if(this.state.loading) {
			orderSummary = <Spinner />
		}

		let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
		
		if(this.state.ingredients) {
			burger = (
				<Aux>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						ingredientAdded={this.addIngredientHandler}
						ingredientRemoved={this.removeIngredientHandler}
						disabled={disabledInfo}
						purchasable={!this.state.purchasable}
						ordered={this.purchaseHandler}
						price={this.state.totalPrice} />
				</Aux>);

			orderSummary = (<OrderSummary 
						ingredients={this.state.ingredients}
						price={this.state.totalPrice.toFixed(2)}
						purchaseCanceled={this.purchaseCancelHandler}
						purchaseContinued={this.purchaseContinueHandler} />);
		}
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axios);