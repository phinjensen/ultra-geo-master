project = QgsProject.instance()
layers = project.mapLayers().values()
for layer in iface.layerTreeView().selectedLayers():
    print(layer.loadNamedStyle("/home/phin/programming/ultra-geo-master/webapp/maps/styles/oceania.qml"))