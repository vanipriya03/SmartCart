import { useEffect, useState } from "react";
import "./App.css";

// SAMPLE PRODUCT DATABASE
const products = [
  {
    id: 1,
    name: "Apple iPhone 15",
    category: "Mobiles",
    price: 54999,
    oldPrice: 69900,
    rating: 4.7,
    emoji: "📱",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    color: "#e9e5ff",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    category: "Mobiles",
    price: 49999,
    oldPrice: 74999,
    rating: 4.6,
    emoji: "📲",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600",
    color: "#e3f1ff",
  },
  {
    id: 3,
    name: "Sony Wireless Headphones",
    category: "Audio",
    price: 7999,
    oldPrice: 12999,
    rating: 4.5,
    emoji: "🎧",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    color: "#fff0e4",
  },
  {
    id: 4,
    name: "boAt Smart Watch",
    category: "Wearables",
    price: 2499,
    oldPrice: 4999,
    rating: 4.3,
    emoji: "⌚",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    color: "#e3f5eb",
  },
  {
    id: 5,
    name: "MacBook Air M2",
    category: "Laptops",
    price: 79990,
    oldPrice: 99900,
    rating: 4.8,
    emoji: "💻",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
    color: "#f0eaff",
  },
  {
    id: 6,
    name: "JBL Bluetooth Speaker",
    category: "Audio",
    price: 2999,
    oldPrice: 4999,
    rating: 4.4,
    emoji: "🔊",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    color: "#fff0f0",
  },
  {
    id: 7,
    name: "Dell Inspiron Laptop",
    category: "Laptops",
    price: 52990,
    oldPrice: 64990,
    rating: 4.2,
    emoji: "🖥️",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    color: "#e9f1ff",
  },
  {
    id: 8,
    name: "Noise Smart Watch",
    category: "Wearables",
    price: 1999,
    oldPrice: 3999,
    rating: 4.1,
    emoji: "⌚",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600",
    color: "#fff5dc",
  },
];

const categories = [
  "All",
  "Mobiles",
  "Laptops",
  "Audio",
  "Wearables",
];

function App() {
  // REACT STATES

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  // Restore saved wishlist when the app starts.
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = window.localStorage.getItem("smartcart-wishlist");
      const parsed = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(parsed)) return [];

      return parsed.filter((id) =>
        products.some((product) => product.id === id)
      );
    } catch (error) {
      console.error("Could not restore wishlist:", error);
      return [];
    }
  });

  const [compare, setCompare] = useState([]);
  const [budget, setBudget] = useState("");

  // Persist wishlist changes in this browser.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        "smartcart-wishlist",
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error("Could not save wishlist:", error);
    }
  }, [wishlist]);

  // COMMON FILTER LOGIC

  function matchesFilters(product) {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    const matchesBudget =
      budget === "" ||
      product.price <= Number(budget);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBudget
    );
  }

  // FILTERED PRODUCTS

  const filteredProducts = products.filter(matchesFilters);

  // SMART RECOMMENDATION ENGINE

  const recommendedProducts = products
    .filter(matchesFilters)
    .map((product) => {
      const discount =
        ((product.oldPrice - product.price) /
          product.oldPrice) * 100;

      // Rating contributes maximum 50 points.
      const ratingScore =
        (product.rating / 5) * 50;

      // Discount contributes maximum 30 points.
      const discountScore =
        Math.min(discount / 50, 1) * 30;

      // Affordability contributes maximum 20 points.
      const affordabilityScore =
        budget === ""
          ? 10
          : (1 - product.price / Number(budget)) * 20;

      const totalScore = Math.round(
        ratingScore +
        discountScore +
        affordabilityScore
      );

      return {
        ...product,
        score: totalScore,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // WISHLIST FUNCTION

  function toggleWishlist(id) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  // COMPARE FUNCTION

  function toggleCompare(id) {
    setCompare((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= 3) {
        alert("You can compare up to 3 products!");
        return current;
      }

      return [...current, id];
    });
  }

  return (
    <div className="app">

      {/* NAVIGATION BAR */}

      <nav className="navbar">
        <a className="logo" href="#">
          <span>🛒</span> SmartCart
        </a>

        <div className="nav-links">
          <a href="#products">Explore</a>
          <a href="#smart">Smart Picks</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-right">
          <span className="wishlist-count">
            ♡ {wishlist.length}
          </span>

          <span className="profile">👤</span>
        </div>
      </nav>

      <main>

        {/* HERO SECTION */}

        <section className="hero" id="smart">
          <div className="hero-content">
            <span className="eyebrow">
              ✦ SHOP SMARTER, NOT HARDER
            </span>

            <h1>
              Find the best deals.
              <br />
              <span>Make smarter choices.</span>
            </h1>

            <p>
              Compare products, discover great deals
              and find the perfect product for your budget.
            </p>

            <a href="#products" className="hero-button">
              Explore products →
            </a>
          </div>

          <div className="hero-art">
            <div className="hero-circle">🛍️</div>

            <div className="floating-card">
              ✨ Smart recommendations
            </div>

            <div className="floating-card second">
              💰 Best value deals
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}

        <section className="products-section" id="products">

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                YOUR SHOPPING DESTINATION
              </span>

              <h2>Explore products</h2>

              <p>
                Discover products that give you more
                value for your money.
              </p>
            </div>

            <span className="result-count">
              {filteredProducts.length} products found
            </span>
          </div>

          {/* SEARCH BAR */}

          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search phones, laptops, headphones..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          {/* CATEGORY AND BUDGET FILTERS */}

          <div className="filters">

            <div className="category-list">
              {categories.map((item) => (
                <button
                  key={item}
                  className={
                    category === item
                      ? "category active"
                      : "category"
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              className="budget-input"
              type="number"
              min="0"
              placeholder="Max budget ₹"
              value={budget}
              onChange={(event) =>
                setBudget(event.target.value)
              }
            />
          </div>

          {/* SMART RECOMMENDATION SECTION */}

          <section className="smart-recommendations" id="recommendations">

            <div className="recommendation-heading">
              <div>
                <span className="eyebrow">
                  ✦ PERSONALIZED PICKS
                </span>

                <h2>Smart picks for you</h2>

                <p>
                  Products ranked using price, ratings
                  and discounts.
                </p>
              </div>

              <span className="ai-label">
                ✨ Best value
              </span>
            </div>

            {recommendedProducts.length > 0 ? (

              <div className="recommendation-grid">

                {recommendedProducts.map((product, index) => (
                  <div
                    className="recommendation-card"
                    key={product.id}
                  >
                    <div className="recommendation-rank">
                      #{index + 1} Recommended
                    </div>

                   <div className="recommendation-image-container">
  <img
    src={product.image}
    alt={product.name}
    className="recommendation-image"
    loading="lazy"
    onError={(event) => {
      event.currentTarget.style.display = "none";
    }}
  />
</div>

<h3>{product.name}</h3>

                    <p className="recommendation-price">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>

                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{
                          width: `${product.score}%`,
                        }}
                      ></div>
                    </div>

                    <p className="score-text">
                      Value score: {product.score}/100
                    </p>

                    <span className="recommendation-reason">
                      ⭐ Rating: {product.rating}/5
                    </span>

                  </div>
                ))}

              </div>

            ) : (

              <p className="no-recommendations">
                No products match your search and budget.
                Try changing your filters.
              </p>

            )}

          </section>

          {/* PRODUCT CARDS */}

          <div className="product-grid">

            {filteredProducts.map((product) => {

              const discount = Math.round(
                ((product.oldPrice - product.price) /
                  product.oldPrice) * 100
              );

              return (
                <article
                  className="product-card"
                  key={product.id}
                >

                  <div
                    className="product-visual"
                    style={{ background: product.color }}
                  >

                    <span className="discount-badge">
                      {discount}% OFF
                    </span>

                    <button
                      className={
                        wishlist.includes(product.id)
                          ? "heart liked"
                          : "heart"
                      }
                      onClick={() =>
                        toggleWishlist(product.id)
                      }
                      aria-label="Toggle wishlist"
                    >
                      {wishlist.includes(product.id)
                        ? "♥"
                        : "♡"}
                    </button>

                    <div className="product-image-container">
  <img
    src={product.image}
    alt={product.name}
    className="product-image"
    loading="lazy"
    onError={(event) => {
      event.currentTarget.style.display = "none";
    }}
  />
</div>

                  </div>

                  <div className="product-info">

                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <div className="rating">
                      ★ {product.rating}
                      <span> Customer rating</span>
                    </div>

                    <div className="price-row">
                      <strong>
                        ₹{product.price.toLocaleString("en-IN")}
                      </strong>

                      <del>
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </del>
                    </div>

                    <button
                      className={
                        compare.includes(product.id)
                          ? "compare-button selected"
                          : "compare-button"
                      }
                      onClick={() =>
                        toggleCompare(product.id)
                      }
                    >
                      {compare.includes(product.id)
                        ? "✓ Added to compare"
                        : "+ Add to compare"}
                    </button>

                  </div>

                </article>
              );
            })}

          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <span>🔎</span>
              <h3>No products found</h3>
              <p>
                Try another search or change your budget.
              </p>
            </div>
          )}

        </section>

        {/* PRODUCT COMPARISON TABLE */}

        {compare.length > 0 && (

          <section
            className="comparison-section"
            id="comparison"
          >

            <div className="comparison-heading">

              <div>
                <span className="eyebrow">
                  MAKE THE RIGHT CHOICE
                </span>

                <h2>Compare products</h2>

                <p>
                  Compare your selected products side by side.
                </p>
              </div>

              <button
                className="clear-button"
                onClick={() => setCompare([])}
              >
                Clear all
              </button>

            </div>

            <div className="comparison-table-wrapper">

              <table className="comparison-table">

                <thead>
                  <tr>

                    <th>Features</th>

                    {compare.map((id) => {

                      const product = products.find(
                        (p) => p.id === id
                      );

                      return (
                        <th key={id}>

                          <div>{product.name}</div>

                          <button
                            className="remove-button"
                            onClick={() =>
                              setCompare((current) =>
                                current.filter(
                                  (item) => item !== id
                                )
                              )
                            }
                          >
                            Remove
                          </button>

                        </th>
                      );
                    })}

                  </tr>
                </thead>

                <tbody>

                  {[
                    {
                      label: "Product name",
                      getValue: (p) => p.name,
                    },
                    {
                      label: "Category",
                      getValue: (p) => p.category,
                    },
                    {
                      label: "Selling price",
                      getValue: (p) =>
                        `₹${p.price.toLocaleString("en-IN")}`,
                    },
                    {
                      label: "Original price",
                      getValue: (p) =>
                        `₹${p.oldPrice.toLocaleString("en-IN")}`,
                    },
                    {
                      label: "Customer rating",
                      getValue: (p) => `★ ${p.rating}/5`,
                    },
                    {
                      label: "Discount",
                      getValue: (p) =>
                        `${Math.round(
                          ((p.oldPrice - p.price) /
                            p.oldPrice) * 100
                        )}% OFF`,
                    },
                  ].map((feature) => (

                    <tr key={feature.label}>

                      <td>{feature.label}</td>

                      {compare.map((id) => {

                        const product = products.find(
                          (p) => p.id === id
                        );

                        return (
                          <td key={id}>
                            {feature.getValue(product)}
                          </td>
                        );
                      })}

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            <p className="comparison-note">
              Comparison is based on the sample product
              information currently available in SmartCart.
            </p>

          </section>

        )}

        {/* FOOTER */}

        <footer id="about">

          <div className="logo">
            🛒 SmartCart
          </div>

          <p>
            Shop smarter. Save better. Choose wisely.
          </p>

          <span>
            © 2026 SmartCart. Built with React.
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;


