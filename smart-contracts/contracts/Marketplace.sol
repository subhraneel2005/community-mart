// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Product {
        uint id;
        string name;
        string description;
        uint price;
        address payable seller;
        bool sold;
    }

    mapping(uint => Product) public products;
    uint public productCount;

    event ProductCreated(
        uint id,
        string name,
        string description,
        uint price,
        address payable seller
    );
    event ProductSold(uint id, address buyer);

    function createProduct(
        string memory _name,
        string memory _description,
        uint _price
    ) public {
        require(_price > 0, "Price must be greater than zero");
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _description,
            _price,
            payable(msg.sender),
            false
        );
        emit ProductCreated(
            productCount,
            _name,
            _description,
            _price,
            payable(msg.sender)
        );
    }

    function buyProduct(uint _id) public payable {
        Product memory _product = products[_id];
        require(!_product.sold, "Product already sold");
        require(msg.value >= _product.price, "Not enough Ether sent");

        _product.seller.transfer(msg.value);
        _product.sold = true;
        products[_id] = _product;

        emit ProductSold(_id, msg.sender);
    }
}
