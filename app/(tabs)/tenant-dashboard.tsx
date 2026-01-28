import React from 'react';
import { Redirect } from 'expo-router';

const TenantDashboardRedirect = () => {
    return <Redirect href="/dashboard/tenant" />;
};

export default TenantDashboardRedirect;
