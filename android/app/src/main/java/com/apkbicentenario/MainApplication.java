import com.reactnativecommunity.permissions.RNPermissionsPackage;

@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new RNPermissionsPackage() // Asegúrate de que esté incluido
  );
}
