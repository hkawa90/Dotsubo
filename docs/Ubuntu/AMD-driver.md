# [Linux® Drivers for AMD Radeon™ and Radeon PRO™ Graphics | AMD](https://www.amd.com/en/support/linux-drivers)

## Download

[Linux® Drivers for AMD Radeon™ and Radeon PRO™ Graphics | AMD](https://www.amd.com/en/support/linux-drivers)よりDOWNLOADしておく。

```shell title="オープンソース版VulkanとOpenCLを選択してインストール"
sudo dpkg -i amdgpu-install_5.7.50700-1_all.deb
sudo amdgpu-install  --vulkan=amdvlk --opencl=rocr
```

## Memo

```shell title="グラフィクスカードを確認する"
lspci | grep VGA
35:00.0 VGA compatible controller: Advanced Micro Devices, Inc. [AMD/ATI] Rembrandt [Radeon 680M] (rev c7)
```
