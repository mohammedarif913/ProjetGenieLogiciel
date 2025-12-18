function verifierDonneesAnormales(feu) {
  // Vérifier si le serveur est en cours d'arrêt
  if (isShuttingDown) return null;

  const feuId = feu.id || feu.ID;

  // Créer un ensemble d'anomalies courantes
  const anomaliesCourantes = new Set();

  // Vérifier les différents types d'anomalies
  if ((feu.tension_service && feu.tension_service.includes('5V')) ||
      (feu.Tension_service && feu.Tension_service.includes('5V'))) {
    anomaliesCourantes.add("tension");
  }

  if ((feu.optiqueCentre === 'NOK') ||
      (feu.optiqueHaut === 'NOK') ||
      (feu.optiqueBas === 'NOK') ||
      (feu.Etat_optique_central === 'NOK') ||
      (feu.Etat_optique_haut === 'NOK') ||
      (feu.Etat_optique_bas === 'NOK')) {
    anomaliesCourantes.add("optique");
  }

  const autonomie = feu.autonomie || feu.Autonomie;
  if (autonomie && autonomie.includes('h')) {
    const heures = parseInt(autonomie);
    if (!isNaN(heures) && heures < 5) {
      anomaliesCourantes.add("autonomie");
    }
  }

  // Obtenir les anomalies précédentes (si elles existent)
  const anomaliesPrecedentes = anomaliesSignalees.get(feuId) || new Set();

  // Déterminer les nouvelles anomalies
  const nouvellesAnomalies = new Set(
    [...anomaliesCourantes].filter(type => !anomaliesPrecedentes.has(type))
  );

  // Déterminer les anomalies résolues
  const anomaliesResolues = new Set(
    [...anomaliesPrecedentes].filter(type => !anomaliesCourantes.has(type))
  );

  // Variable pour suivre si un email a été envoyé
  let emailEnvoye = false;

  // Si nous avons de nouvelles anomalies, envoyer un email
  if (nouvellesAnomalies.size > 0) {
    // Construire le message d'anomalie
    const messages = [];
    if (nouvellesAnomalies.has("tension")) {
      messages.push("Tension de service anormale: " + (feu.tension_service || feu.Tension_service));
    }
    if (nouvellesAnomalies.has("optique")) {
      messages.push("État optique défectueux détecté");
    }
    if (nouvellesAnomalies.has("autonomie")) {
      messages.push("Autonomie critique: " + (feu.autonomie || feu.Autonomie));
    }

    const messageAnomalie = messages.join(", ");
    console.log(`ALERTE! Nouvelles anomalies pour ${feuId}: ${messageAnomalie}`);

    try {
      // Envoyer l'alerte par email
      envoyerAlerte(feu, messageAnomalie);
      emailEnvoye = true;
    } catch (error) {
      console.error(`ERREUR lors de l'envoi de l'email pour ${feuId}: ${error.message}`);
    }

    // Envoyer l'alerte au frontend
    try {
      io.emit('feu_anomalie', {
        id: feuId,
        type: 'anomalie',
        message: messageAnomalie,
        details: feu,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`ERREUR lors de l'envoi de la notification pour ${feuId}: ${error.message}`);
    }
  }

  // Si nous avons des anomalies résolues, envoyer une notification
  if (anomaliesResolues.size > 0) {
    // Construire le message de résolution
    const messages = [];
    if (anomaliesResolues.has("tension")) {
      messages.push("Tension de service normalisée");
    }
    if (anomaliesResolues.has("optique")) {
      messages.push("État optique rétabli");
    }
    if (anomaliesResolues.has("autonomie")) {
      messages.push("Autonomie rétablie");
    }

    const messageResolution = messages.join(", ");
    console.log(`RÉSOLUTION! Anomalies résolues pour ${feuId}: ${messageResolution}`);

    // Envoyer la notification au frontend
    try {
      io.emit('feu_resolution', {
        id: feuId,
        type: 'resolution',
        message: messageResolution,
        details: feu,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`ERREUR lors de l'envoi de la notification de résolution pour ${feuId}: ${error.message}`);
    }

    // Option: Envoyer un email de résolution
    // envoyerNotificationResolution(feu, messageResolution);
  }

  // Mettre à jour les anomalies SIGNALÉES
  if (anomaliesCourantes.size > 0) {
    anomaliesSignalees.set(feuId, anomaliesCourantes);
  } else if (anomaliesPrecedentes.size > 0) {
    // Si plus d'anomalies, supprimer l'entrée
    anomaliesSignalees.delete(feuId);
  }

  // Retourner un objet avec plus d'informations pour permettre au code appelant
  // de savoir si un email a déjà été envoyé
  if (anomaliesCourantes.size > 0) {
    return {
      message: "Anomalies: " + [...anomaliesCourantes].join(", "),
      emailEnvoye: emailEnvoye,
      nouvellesAnomalies: [...nouvellesAnomalies],
      anomaliesResolues: [...anomaliesResolues]
    };
  } else {
    return null;
  }
}
