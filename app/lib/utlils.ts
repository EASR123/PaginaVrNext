export async function getUserRoleByEmail(email: string) {
  try {
    const response = await fetch(`/api/users/role?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el rol del usuario');
    }
    
    const data = await response.json();
    
    if (data.ok) {
      return data.usuario.rol;
    } else {
      throw new Error(data.error || 'Error desconocido');
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}