/* Admin gestion des utilisateurs */
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { get_all_users, update_user, delete_user } from '@/api/admin'

export default function UsersManagement() {
  const queryClient = useQueryClient()
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    birthDate: '',
    phoneNumber: '',
    role: '',
    isActive: true
  })

  // Récupération de tous les utilisateurs
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: get_all_users
  })

  // Mutation pour la mise à jour d'un utilisateur
  const updateUserMutation = useMutation({
    mutationFn: (userData) => update_user(userData.id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      setIsEditMode(false)
      setIsDetailsOpen(false)
      setSelectedUser(null)
    }
  })

  // Mutation pour la suppression d'un utilisateur
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => delete_user(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      setIsDeleteDialogOpen(false)
      setIsDetailsOpen(false)
      setSelectedUser(null)
    }
  })

  const handleUserClick = (user) => {
    setSelectedUser(user)
    setEditForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      birthDate: user.birthDate || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role,
      isActive: user.isActive
    })
    setIsDetailsOpen(true)
  }

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleSaveClick = () => {
    updateUserMutation.mutate({
      id: selectedUser.id,
      ...editForm
    })
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteUserMutation.mutate(selectedUser.id)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">Erreur lors du chargement des utilisateurs.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8">Gestion des utilisateurs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map(user => (
          <Card 
            key={user.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleUserClick(user)}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="font-semibold">{user.firstname} {user.lastname}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-sm text-gray-600">Rôle: {user.role}</div>
                <div className={`text-sm ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  Statut: {user.isActive ? 'Actif' : 'Inactif'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modale de détails/modification */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Modifier l\'utilisateur' : 'Détails de l\'utilisateur'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom</label>
              <Input
                name="firstname"
                value={editForm.firstname}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input
                name="lastname"
                value={editForm.lastname}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date de naissance</label>
              <Input
                name="birthDate"
                type="date"
                value={editForm.birthDate}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Numéro de téléphone</label>
              <Input
                name="phoneNumber"
                value={editForm.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rôle</label>
              <select
                name="role"
                value={editForm.role}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className="w-full border rounded-md p-2"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
                <option value="trainer">Formateur</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={editForm.isActive}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className="rounded border-gray-300"
              />
              <label className="text-sm font-medium">Compte actif</label>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveClick}>
                  Enregistrer
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleEditClick}>
                  Modifier
                </Button>
                <Button variant="destructive" onClick={handleDeleteClick}>
                  Supprimer
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
