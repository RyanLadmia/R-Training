'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { get_profile_user_by_id, update_profile } from '../../api/admin';
import { useAuth } from '../../contexts/authContext';
import { toLocalPhoneNumber } from '../../../../back/src/utils/phoneNumber';
import { formatBirthDate } from '../../../../back/src/utils/birthDate';
import defaultProfilePicture from '../../assets/images/profile-picture-placeholder.png';

const AdminProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    birthDate: ''
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: () => get_profile_user_by_id(user?.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (data && data.success) {
      setProfile(data);
      setFormData({
        firstname: data.data.firstname || '',
        lastname: data.data.lastname || '',
        email: data.data.email || '',
        phoneNumber: data.data.phoneNumber || '',
        birthDate: data.data.birthDate || '',
        password: '',
        confirmPassword: ''
      });
      setPreviewUrl(data.data.profilePicture || defaultProfilePicture);
    }
  }, [data]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('firstname', formData.firstname);
    formDataToSend.append('lastname', formData.lastname);
    formDataToSend.append('email', formData.email);
    if (formData.password) {
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirmPassword', formData.confirmPassword);
    }
    if (formData.phoneNumber) {
      formDataToSend.append('phoneNumber', formData.phoneNumber);
    }
    if (formData.birthDate) {
      formDataToSend.append('birthDate', formData.birthDate);
    }
    if (selectedFile) {
      formDataToSend.append('profilePicture', selectedFile);
    }

    try {
      await update_profile(profile.data.id, formDataToSend);
      setIsEditing(false);
      // Rafraîchir les données
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    const local = toLocalPhoneNumber(phone);
    return local.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  if (error || !profile) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">
      Erreur lors du chargement des informations.
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      <div className="flex-1 p-8 mt-16">
        <h1 className="text-2xl font-bold mb-8">Mon Profil Administrateur</h1>
        <Card className="p-6 flex flex-col items-center text-center mb-8">
          <div className="relative mb-6">
            <img
              src={previewUrl || defaultProfilePicture}
              alt="Photo de profil"
              className="w-32 h-32 rounded-full object-cover"
            />
            {isEditing && (
              <div className="absolute bottom-0 right-0">
                <label htmlFor="profilePicture" className="cursor-pointer bg-blue-500 text-white p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          <div className="w-full">
            <h2 className="text-xl font-bold mb-2">
              {profile.data.firstname} {profile.data.lastname}
            </h2>
            <p className="text-gray-600 mb-4">{profile.data.email}</p>
            <div className="flex justify-between px-4 py-2 bg-gray-50 rounded">
              <span className="font-medium">Rôle:</span>
              <span className="capitalize">{profile.data.role}</span>
            </div>
            {profile.data.phoneNumber && (
              <div className="flex justify-between px-4 py-2 mt-2 bg-gray-50 rounded">
                <span className="font-medium">Téléphone:</span>
                <span>{formatPhoneNumber(profile.data.phoneNumber)}</span>
              </div>
            )}
            {profile.data.birthDate && (
              <div className="flex justify-between px-4 py-2 mt-2 bg-gray-50 rounded">
                <span className="font-medium">Date de naissance:</span>
                <span>{formatBirthDate(profile.data.birthDate)}</span>
              </div>
            )}
            {profile.data.createdAt && (
              <div className="flex justify-between px-4 py-2 mt-2 bg-gray-50 rounded">
                <span className="font-medium">Compte créé le:</span>
                <span>{profile.data.createdAt}</span>
              </div>
            )}
          </div>
        </Card>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-md mx-auto">
            <input 
              type="text" 
              name="firstname" 
              value={formData.firstname} 
              onChange={handleInputChange} 
              placeholder="Prénom" 
              className="border p-2 rounded"
              required
            />
            <input 
              type="text" 
              name="lastname" 
              value={formData.lastname} 
              onChange={handleInputChange} 
              placeholder="Nom" 
              className="border p-2 rounded"
              required
            />
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              placeholder="Email" 
              className="border p-2 rounded"
              required
            />
            <input 
              type="tel" 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleInputChange} 
              placeholder="Numéro de téléphone" 
              className="border p-2 rounded"
            />
            <input 
              type="date" 
              name="birthDate" 
              value={formData.birthDate} 
              onChange={handleInputChange} 
              placeholder="Date de naissance" 
              className="border p-2 rounded"
            />
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleInputChange}
              placeholder="Nouveau mot de passe" 
              className="border p-2 rounded"
            />
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              placeholder="Confirmer le mot de passe" 
              className="border p-2 rounded"
            />
            <div className="flex space-x-2">
              <button 
                type="submit" 
                className="bg-blue-500 text-white p-2 rounded flex-1"
              >
                Enregistrer
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="bg-gray-300 text-gray-800 p-2 rounded flex-1"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-center">
            <button 
              onClick={handleEditClick} 
              className="bg-blue-500 text-white p-2 rounded mt-4"
            >
              Modifier mon profil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;