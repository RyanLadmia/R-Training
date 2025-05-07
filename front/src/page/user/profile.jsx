/*User Profile*/
'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { get_profile_user_by_id } from '@/api/admin';
import { useAuth } from '@/contexts/authContext';

const UserProfile = () => {
  const { user } = useAuth();
  const userId = localStorage.getItem('userId');

  const { data, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => get_profile_user_by_id(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">Erreur lors du chargement des informations.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8">Mon Profil</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Prénom</p>
              <p className="font-medium">{data?.firstname || user?.firstname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-medium">{data?.lastname || user?.lastname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{data?.email || user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rôle</p>
              <p className="font-medium capitalize">{data?.role || user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;


