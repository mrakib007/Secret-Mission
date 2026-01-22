import { 
  useGetApiQuery, 
  useGetApiWithIdQuery,
  usePostApiMutation,
  usePostFormDataApiMutation,
  useUpdateApiJsonMutation,
  useUpdateApiMutation,
  useUpdateFormDataAutoApiMutation,
  usePatchApiMutation,
  useDeleteApiMutation 
} from '../store/api/commonApi';

// Main data fetching hook for GET requests
const useDataFetching = ({ queryKey, endPoint, params = {}, enabled = true }) => {
  const { id, ...otherParams } = params;
  
  // Use different hooks based on whether we have an ID
  const queryWithId = useGetApiWithIdQuery(
    { url: endPoint, id },
    { skip: !enabled || !id }
  );
  
  const queryWithoutId = useGetApiQuery(
    { url: endPoint, params: otherParams },
    { skip: !enabled || !!id }
  );
  
  // Return the appropriate query result
  const activeQuery = id ? queryWithId : queryWithoutId;
  
  return {
    data: activeQuery.data,
    isLoading: activeQuery.isLoading,
    error: activeQuery.error,
    isSuccess: activeQuery.isSuccess,
    isError: activeQuery.isError,
    refetch: activeQuery.refetch,
  };
};

// Hook for POST requests (JSON)
export const useCreateData = ({ mutationKey, endPoint, onSuccess, onError }) => {
  const [postApi, mutation] = usePostApiMutation();
  
  const mutateAsync = async (data) => {
    try {
      const result = await postApi({ end_point: endPoint, body: data }).unwrap();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  };
  
  return {
    mutateAsync,
    ...mutation,
  };
};

// Hook for POST requests (FormData)
export const useCreateFormData = ({ mutationKey, endPoint, onSuccess, onError }) => {
  const [postFormDataApi, mutation] = usePostFormDataApiMutation();
  
  const mutateAsync = async (data) => {
    try {
      const result = await postFormDataApi({ end_point: endPoint, body: data }).unwrap();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  };
  
  return {
    mutateAsync,
    ...mutation,
  };
};

// Hook for PUT/PATCH requests (JSON)
export const useUpdateData = ({ mutationKey, endPoint, onSuccess, onError, method = 'PUT' }) => {
  const [updateApiJson, updateMutation] = useUpdateApiJsonMutation();
  const [patchApi, patchMutation] = usePatchApiMutation();
  
  const activeHook = method === 'PATCH' ? [patchApi, patchMutation] : [updateApiJson, updateMutation];
  const [mutationFn, mutation] = activeHook;
  
  const mutateAsync = async ({ id, data }) => {
    try {
      const endpoint = id ? `${endPoint}/${id}` : endPoint;
      const result = await mutationFn({ end_point: endpoint, body: data }).unwrap();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  };
  
  return {
    mutateAsync,
    ...mutation,
  };
};

// Hook for PUT/PATCH requests (FormData)
export const useUpdateFormData = ({ mutationKey, endPoint, onSuccess, onError, method = 'PUT' }) => {
  const [updateFormDataAutoApi, mutation] = useUpdateFormDataAutoApiMutation();
  
  const mutateAsync = async ({ id, data }) => {
    try {
      const endpoint = id ? `${endPoint}/${id}` : endPoint;
      const result = await updateFormDataAutoApi({ end_point: endpoint, body: data }).unwrap();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  };
  
  return {
    mutateAsync,
    ...mutation,
  };
};

// Hook for DELETE requests
export const useDeleteData = ({ mutationKey, endPoint, onSuccess, onError }) => {
  const [deleteApi, mutation] = useDeleteApiMutation();
  
  const mutateAsync = async (id) => {
    try {
      const endpoint = id ? `${endPoint}/${id}` : endPoint;
      const result = await deleteApi({ end_point: endpoint }).unwrap();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  };
  
  return {
    mutateAsync,
    ...mutation,
  };
};

export default useDataFetching;