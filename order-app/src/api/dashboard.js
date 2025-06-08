// Mock dashboard data API
export const getDashboardData = async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      success: true,
      data: {
        stats: {
          totalBuyers: 1245,
          totalSellers: 568,
          totalProducts: 3421,
          ordersReceived: 289,
          ordersGiven: 156
        },
        recentOrders: [
          { id: 1, product: 'Product A', buyer: 'Buyer 1', date: '2023-05-01', amount: 120 },
          { id: 2, product: 'Product B', buyer: 'Buyer 2', date: '2023-05-02', amount: 85 },
          { id: 3, product: 'Product C', buyer: 'Buyer 3', date: '2023-05-03', amount: 210 }
        ],
        salesChart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          data: [65, 59, 80, 81, 56]
        }
      }
    };
  };