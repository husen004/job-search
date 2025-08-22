import { ToastProvider } from './components/ui/ToastProvider';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          {/* Your app content */}
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  );
};