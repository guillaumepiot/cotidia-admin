import os

from setuptools import find_packages, setup


def package_files(dirs):
    paths = []

    for directory in dirs:
        for path, directories, filenames in os.walk(directory):
            path = path.replace(directory, directory.split("/")[-1])

            for filename in filenames:
                paths.append(os.path.join(path, filename))

    return paths


template_files = package_files(["cotidia/admin/templates", "cotidia/admin/static"])

setup(
    name="cotidia-admin",
    description="Admin tools for backend generation.",
    version="1.0",
    author="Guillaume Piot",
    author_email="guillaume@cotidia.com",
    url="https://code.cotidia.com/cotidia/admin/",
    packages=find_packages(),
    package_dir={"admin": "admin"},
    package_data={"cotidia.admin": template_files},
    namespace_packages=["cotidia"],
    include_package_data=True,
    install_requires=[
        "django-betterforms==1.1.*",
        "django-filter==2.4",
        "django-extensions==2.1.*",
    ],
    classifiers=[
        "Framework :: Django",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: BSD License",
        "Operating System :: OS Independent",
        "Topic :: Software Development",
    ],
)
