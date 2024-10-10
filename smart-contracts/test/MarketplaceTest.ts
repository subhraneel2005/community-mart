import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Marketplace Contract", function () {
  async function deployMarketplaceFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the Marketplace contract
    const Marketplace = await ethers.deployContract("Marketplace");
    await Marketplace.waitForDeployment();

    return { Marketplace, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { Marketplace, owner } = await loadFixture(deployMarketplaceFixture);
      // No "owner" method in contract, checking ownership through a created product
      await Marketplace.createProduct("Sample Product", "Description", 100);
      const product = await Marketplace.products(1);
      expect(product.seller).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should create a new product", async function () {
      const { Marketplace, owner, addr1 } = await loadFixture(deployMarketplaceFixture);

      // Add a new product
      await expect(Marketplace.createProduct("Item1", "Description1", 100))
        .to.emit(Marketplace, "ProductCreated")
        .withArgs(1, "Item1", "Description1", 100, owner.address);
    });

    it("Should sell a product to a buyer", async function () {
      const { Marketplace, owner, addr1 } = await loadFixture(deployMarketplaceFixture);

      // Create a product and then sell it to addr1
      await Marketplace.createProduct("Item1", "Description1", 100);
      await expect(
        Marketplace.connect(addr1).buyProduct(1, { value: 100 })
      )
        .to.emit(Marketplace, "ProductSold")
        .withArgs(1, addr1.address);
    });

    it("Should fail if the product price is incorrect", async function () {
      const { Marketplace, addr1 } = await loadFixture(deployMarketplaceFixture);

      // Create a product and attempt to buy with incorrect price
      await Marketplace.createProduct("Item1", "Description1", 100);
      await expect(
        Marketplace.connect(addr1).buyProduct(1, { value: 50 })
      ).to.be.revertedWith("Not enough Ether sent");
    });
  });

  describe("Products", function () {
    it("Should list all available products", async function () {
      const { Marketplace, owner } = await loadFixture(deployMarketplaceFixture);

      // Create a few products
      await Marketplace.createProduct("Item1", "Description1", 100);
      await Marketplace.createProduct("Item2", "Description2", 200);

      // Retrieve the list of products
      const product1 = await Marketplace.products(1);
      const product2 = await Marketplace.products(2);

      expect(product1.name).to.equal("Item1");
      expect(product2.name).to.equal("Item2");
    });
  });
});
