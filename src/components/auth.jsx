// import { useMutation, QueryClient, QueryClientProvider } from 'react-query';

// const queryClient = new QueryClient();

// const RegistrationForm = () => {
//   const registerMutation = useMutation((formData) => {
//     // Выполните запрос к API для регистрации пользователя и получения токена
//     return api.register(formData);
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     // Запустите мутацию для отправки данных формы
//     registerMutation.mutate(Object.fromEntries(formData));
//   };

//   if (registerMutation.isSuccess) {
//     // Если мутация выполнена успешно, сохраните полученный токен в React Query's global cache
//     queryClient.setQueryData('token', registerMutation.data.token);
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Ваши поля формы */}
//       <button type="submit">Зарегистрироваться</button>
//     </form>
//   );
// };
