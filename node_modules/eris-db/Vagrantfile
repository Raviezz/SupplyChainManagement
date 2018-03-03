# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
  end

  config.vm.box = "debian/contrib-jessie64"
  config.vm.provision "shell", inline: "run-parts /vagrant/Vagrant/privileged"

  ["release_0.12", "release-0.16"].each do |branch|
    config.vm.define branch do |node|
      node.vm.provision "shell",
        env: {"BRANCH" => branch},
        # Use 'su' instead of running as a non-privileged user so that changes
        # to the user's new groups are picked up.
        inline: "su --command 'run-parts /vagrant/Vagrant' vagrant"
    end
  end
end
