import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../../api/dashboard';
import { Container, Row, Col, Card, Spinner, Alert, Table } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('inside dashboare index useeffect')
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        if (response.success) {
          setData(response.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError('An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  if (error) return (
    <Container>
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="g-4 mb-4">
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Buyers</Card.Title>
              <Card.Text className="display-6">{data?.stats.totalBuyers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Sellers</Card.Title>
              <Card.Text className="display-6">{data?.stats.totalSellers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <Card.Text className="display-6">{data?.stats.totalProducts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Orders Received</Card.Title>
              <Card.Text className="display-6">{data?.stats.ordersReceived}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Orders Given</Card.Title>
              <Card.Text className="display-6">{data?.stats.ordersGiven}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card>
            <Card.Body>
              <Card.Title>Sales Overview</Card.Title>
              <div style={{ height: '300px' }}>
                <Bar
                  data={{
                    labels: data?.salesChart.labels,
                    datasets: [
                      {
                        label: 'Sales',
                        data: data?.salesChart.data,
                        backgroundColor: 'rgba(13, 110, 253, 0.5)',
                        borderColor: 'rgba(13, 110, 253, 1)',
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>Orders Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <Pie
                  data={{
                    labels: ['Received', 'Given'],
                    datasets: [
                      {
                        data: [data?.stats.ordersReceived, data?.stats.ordersGiven],
                        backgroundColor: [
                          'rgba(13, 110, 253, 0.5)',
                          'rgba(25, 135, 84, 0.5)'
                        ],
                        borderColor: [
                          'rgba(13, 110, 253, 1)',
                          'rgba(25, 135, 84, 1)'
                        ],
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Card.Title>Recent Orders</Card.Title>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.product}</td>
                  <td>{order.buyer}</td>
                  <td>{order.date}</td>
                  <td>${order.amount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;