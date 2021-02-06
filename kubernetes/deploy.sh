#!/bin/bash
kubectl -n $KUBE_NAMESPACE apply -f kubernetes/config.yaml
kubectl -n $KUBE_NAMESPACE set image deployment/bookbnb-payments payments=$IMAGE_NAME:$IMAGE_VERSION
