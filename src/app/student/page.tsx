import {
  Search,
  Home,
  FileText,
  FolderKanban,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import styles from "./student.module.css";

type Item = {
  id: number;
  name: string;
  category: string;
  status: string;
  image: string;
};

const sampleItems: Item[] = [
  {
    id: 1,
    name: "Black Backpack",
    category: "Bags",
    status: "Found",
    image: "/image/student/black_backpack.jpeg",
  },
  {
    id: 2,
    name: "Silver iPhone",
    category: "Electronics",
    status: "Found",
    image: "/image/student/silver iphone.jpeg",
  },
  {
    id: 3,
    name: "Set of Keys",
    category: "Accessories",
    status: "Found",
    image: "/image/student/keys.jpeg",
  },
  {
    id: 4,
    name: "AirPods",
    category: "Electronics",
    status: "Found",
    image: "/image/student/airpods.jpeg",
  },
  {
    id: 5,
    name: "Wallet",
    category: "Accessories",
    status: "Found",
    image: "/image/student/wallet.jpeg",
  },
  {
    id: 6,
    name: "Water Bottle",
    category: "Personal Items",
    status: "Found",
    image: "/image/student/water bottle.jpeg",
  },
];

export default function StudentPage() {
  return (
    <div className={styles.studentPage}>
      <aside className={styles.studentSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.studentBrand}>
            <div className={styles.brandIcon}>🛡️</div>
            <div>
              <h2>Lost &amp; Found</h2>
              <p>Student Homepage</p>
            </div>
          </div>

          <nav className={styles.studentNav}>
            <a href="/student" className={`${styles.navItem} ${styles.active}`}>
              <Home size={20} />
              <span>Home</span>
            </a>
            <a href="/student/report_items" className={styles.navItem}>
              <FileText size={20} />
              <span>Report Item</span>
            </a>
            <a href="#" className={styles.navItem}>
              <FolderKanban size={20} />
              <span>My Claims</span>
            </a>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.profileMini}>N</div>

          <a href="#" className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Log Out</span>
          </a>
        </div>
      </aside>
      <main className={styles.studentMain}>
        <header className={styles.studentTopbar}>
          <div className={styles.pageTitleWrap}>
            {/* <Search size={34} className={styles.topSearchIcon} /> */}
            {/* <h1>Lost</h1> */}
            {/* <ChevronRight size={20} className={styles.crumbArrow} /> */}
          </div>

          <div className={styles.topbarRight}>
            <nav className={styles.topLinks}>
              <a
                href="#"
                className={`${styles.topLink} ${styles.topLinkActive}`}
              >
                Home
              </a>
              <a href="/student/report_items" className={styles.topLink}>
                Report Item
              </a>
              <a href="#" className={styles.topLink}>
                My Claims
              </a>
            </nav>

            <div className={styles.userBox}>
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="User"
                className={styles.userAvatar}
              />
              <span>John Doe</span>
              <ChevronDown size={18} />
            </div>
          </div>
        </header>

        <section className={styles.searchBanner}>
          <h2>
            <strong>Lost Something?</strong> Find your lost items here.
          </h2>

          <div className={styles.searchBox}>
            <div className={styles.searchInputWrap}>
              <Search size={24} />
              <input type="text" placeholder="Search for items..." />
            </div>
            <button className={styles.searchBtn}>Search</button>
          </div>
        </section>

        <section className={styles.filtersRow}>
          <div className={styles.filterSelect}>
            <select defaultValue="all">
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="bags">Bags</option>
              <option value="accessories">Accessories</option>
              <option value="personal-items">Personal Items</option>
              <option value="documents">Documents</option>
              <option value="clothing">Clothing</option>
              <option value="keys">Keys</option>
            </select>
            <ChevronDown size={18} />
          </div>

          <div className={styles.filterSelect}>
            <select defaultValue="color">
              <option value="color">Color</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="brown">Brown</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="others">Others</option>
            </select>
            <ChevronDown size={18} />
          </div>
          <div className={styles.filterSelect}>
            <select defaultValue="newest">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <ChevronDown size={18} />
          </div>

          <div className={styles.filterSelect}>
            <select defaultValue="az">
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
            <ChevronDown size={18} />
          </div>
        </section>

        <section className={styles.itemsSection}>
          <h3>Recent Found Items</h3>

          <div className={styles.itemsGrid}>
            {sampleItems.map((item) => (
              <div className={styles.itemCard} key={item.id}>
                <div className={styles.itemImageWrap}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <h4>{item.name}</h4>
                  <button className={styles.claimBtn}>Claim Item</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
