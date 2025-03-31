import React from 'react';
import { Layout, BackTop } from 'antd';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';

const { Content } = Layout;

const MainLayout = ({ children }) => {
    return (
        <Layout className="main-layout">
            <Header />
            <Content style={{ padding: '0 50px', marginTop: 24, marginBottom: 24, minHeight: 'calc(100vh - 134px)' }}>
                {children}
            </Content>
            <Footer />
            <CartDrawer />
            <BackTop />
        </Layout>
    );
};

export default MainLayout;