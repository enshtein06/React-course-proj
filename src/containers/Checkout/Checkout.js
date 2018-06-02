import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import CheckoutSummary from './../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
	state = {
		ingredients: null,
		totalPrice: 0
	}

	componentWillMount () {
		const query = new URLSearchParams(this.props.location.search);
		const ingredients = {};
		let price;
		for (let param of query.entries()) {
			if(param[0] === 'price') {
				price = param[1];
			} else {
				ingredients[param[0]] = +param[1];
			}
		}
		this.setState({ingredients, totalPrice: price});
	}

	checkoutCanceledHandle = () => {
		this.props.history.goBack();
	}

	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data');
	}

	render() {
		return (
			<div>
				<CheckoutSummary 
					ingredients={this.state.ingredients}
					onCheckoutCanceled={this.checkoutCanceledHandle}
					checoutContinued={this.checkoutContinuedHandler} />
				<Route 
					path={this.props.match.path + '/contact-data'} 
					render={(props) => (<ContactData 
						ingredients={this.state.ingredients} 
						price={this.state.totalPrice} {...props} />)} />
			</div>
		);
	}
}

export default Checkout;