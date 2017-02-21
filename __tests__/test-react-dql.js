import React, { Component } from 'react'
import renderer from 'react-test-renderer'

import {
  Actor,
  Store,
  StoreProvider,
  Relax,
  DQL,
} from '../src/index'

jest.mock('react-dom')

class ProductActor extends Actor {
  defaultState() {
    return {
      products: [
        { id: 1, name: 'p1' },
        { id: 2, name: 'p2' },
        { id: 3, name: 'p3' },
        { id: 4, name: 'p4' },
        { id: 5, name: 'p5' },
        { id: 6, name: 'p6' },
      ]
    }
  }
}

class Appstore extends Store {
  bindActor() {
    return [new ProductActor]
  }
}

@StoreProvider(Appstore)
class ProductApp extends Component {
  render() {
    const products = this.props.store.state().get('products')
    return (
      <div>
        {products.map((p, index) => <ProductItem index={index} key={p.get('id')} />)}
      </div>
    )
  }
}

const productDQL = DQL('productDQL', [
  ['products', '$index'],
  p => p
])

@Relax
class ProductItem extends Component {
  static defaultProps = {
    index: 0,
    product: productDQL
  };

  render() {
    const {id, name} = this.props.product.toJS()

    return (
      <div>
        <div>{id}</div>
        <div>{name}</div>
      </div>
    )
  }
}


describe('react-dql test suite', () => {
  it('initial dql', () => {
    const tree = renderer.create(<ProductApp />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})